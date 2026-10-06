/* ============================================================
   filters.js — rules for merging live publication data

   Loaded by index.html before script.js. Pure browser JavaScript:
   no modules, no bundler, no Node.

   Why any of this is needed: OpenAlex author disambiguation is
   imperfect. This author id also carries a marketing paper and a
   general-topology paper written by different people of the same
   name, plus repository deposits and translations that duplicate
   entries already in the list. Everything below exists to keep
   those off the page.
   ============================================================ */

var PubFilter = (function () {
  'use strict';

  /* Vocabulary this corpus actually uses. A genuinely new paper by
     this author is expected to hit one of these, or to be written
     with someone he has published with before. */
  var DOMAIN = new RegExp([
    'ramanujan', 'theta', 'modular', 'continued fraction', 'eisenstein',
    'hypergeometric', 'q-series', 'partition', 'elliptic', 'class invariant',
    'congruence', 'identit', 'eta.?(function|quotient)', 'quadratic form',
    'convolution sum', 'number theor', 'summation', 'lambert', 'crank',
    'dissection', 'singular modul', 'infinite (series|product)', 'divisor'
  ].join('|'), 'i');

  var REPOSITORY = /myprints|repositor|university library|figshare|zenodo|semantic scholar/i;

  /* Fold diacritics so "Schläfli" and "Schlafli" compare equal. */
  function fold(s) {
    var t = String(s || '');
    return t.normalize ? t.normalize('NFD').replace(/[̀-ͯ]/g, '') : t;
  }

  function normTitle(s) {
    return fold(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /* Significant words, lightly stemmed, for overlap comparison. */
  function words(s) {
    return fold(s).toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/)
      .filter(function (w) { return w.length > 3; })
      .map(function (w) { return w.replace(/s$/, ''); });
  }

  function overlap(a, b) {
    var A = words(a), B = words(b);
    if (!A.length || !B.length) { return 0; }
    var setB = {}, seen = {}, hits = 0;
    B.forEach(function (w) { setB[w] = true; });
    A.forEach(function (w) {
      if (setB[w] && !seen[w]) { seen[w] = true; hits++; }
    });
    return hits / Math.min(A.length, B.length);
  }

  function mostlyNonLatin(s) {
    var letters = String(s).replace(/[^\p{L}]/gu, '');
    if (!letters.length) { return false; }
    var latin = letters.replace(/[^\p{Script=Latin}]/gu, '');
    return (latin.length / letters.length) < 0.5;
  }

  function cleanTitle(t) {
    return String(t || '').replace(/\$/g, '').replace(/\s+/g, ' ').trim();
  }

  /* "Nagendra Prabhu" -> "N Prabhu", matching the snapshot's style. */
  function shortName(full) {
    var parts = String(full || '').replace(/\./g, '').split(/\s+/).filter(Boolean);
    if (parts.length < 2) { return parts[0] || ''; }
    var last = parts.pop();
    return parts.map(function (p) { return p.charAt(0).toUpperCase(); }).join('') + ' ' + last;
  }

  function venueOf(w) {
    var loc = w.primary_location || {};
    var src = loc.source || {};
    var name = src.display_name || '';
    var b = w.biblio || {};
    if (name && b.volume) {
      name += ' ' + b.volume + (b.issue ? '(' + b.issue + ')' : '');
      if (b.first_page) { name += ', ' + b.first_page + (b.last_page ? '–' + b.last_page : ''); }
    }
    return name;
  }

  function authorNames(w) {
    return (w.authorships || []).map(function (x) {
      return shortName(x.author && x.author.display_name);
    }).filter(Boolean);
  }

  /* Is this work plausibly by *this* author, in *this* field? */
  function isRelevant(w, knownCoauthors) {
    var title = cleanTitle(w.title);
    if (!title || !w.publication_year) { return false; }
    if (mostlyNonLatin(title)) { return false; }            // translation of a listed paper

    var field = ((w.primary_topic || {}).field || {}).display_name || '';
    if (field && field !== 'Mathematics') { return false; } // different person, same name

    var venue = venueOf(w);
    if (REPOSITORY.test(venue)) { return false; }           // deposit copy of a listed paper
    if (!venue && !w.doi) { return false; }                 // fragmentary record

    if (DOMAIN.test(title)) { return true; }

    var others = authorNames(w).filter(function (n) { return !/vasuki/i.test(n); });
    if (!others.length) { return true; }                    // solo work
    return others.some(function (n) { return knownCoauthors.indexOf(n) !== -1; });
  }

  /* Already on the list? Exact, then prefix, then word overlap. */
  function findDuplicate(title, year, pubs) {
    var key = normTitle(title);

    for (var i = 0; i < pubs.length; i++) {
      var k = normTitle(pubs[i].t);
      if (k === key) { return pubs[i]; }
      if (k.length > 25 && key.length > 25 && k.slice(0, 25) === key.slice(0, 25)) { return pubs[i]; }
      if (Math.abs((pubs[i].y || 0) - (year || 0)) <= 1 && overlap(title, pubs[i].t) >= 0.75) { return pubs[i]; }
    }
    return null;
  }

  function toPub(w) {
    return {
      t: cleanTitle(w.title),
      a: authorNames(w).join(', '),
      v: venueOf(w),
      y: w.publication_year,
      c: w.cited_by_count || 0,
      doi: w.doi || ''
    };
  }

  /* One pass over an OpenAlex result set.
     Returns { added: [...], linked: n, skipped: n } and mutates `pubs`. */
  function merge(works, pubs) {
    var known = [];
    pubs.forEach(function (p) {
      p.a.split(/,\s*/).forEach(function (n) {
        if (n && !/vasuki/i.test(n) && known.indexOf(n) === -1) { known.push(n); }
      });
    });

    var added = [], linked = 0, skipped = 0, seen = {};

    works.forEach(function (w) {
      var title = cleanTitle(w.title);
      var key = normTitle(title);
      if (!key || seen[key]) { return; }      // a work can sit under both author ids
      seen[key] = true;

      var hit = findDuplicate(title, w.publication_year, pubs);
      if (hit) {
        if (!hit.doi && w.doi) { hit.doi = w.doi; linked++; }
        return;
      }

      if (!isRelevant(w, known)) { skipped++; return; }

      var p = toPub(w);
      pubs.push(p);
      added.push(p);
    });

    return { added: added, linked: linked, skipped: skipped };
  }

  return {
    normTitle: normTitle,
    cleanTitle: cleanTitle,
    shortName: shortName,
    venueOf: venueOf,
    isRelevant: isRelevant,
    findDuplicate: findDuplicate,
    toPub: toPub,
    merge: merge,
    OA_AUTHORS: ['A5057185385', 'A5126491828'],
    SCHOLAR_USER: '9Ucx9csAAAAJ',

    /* Mathematics-only (fields/26) keeps the wrong-person records out
       server-side; isRelevant() re-checks in case the filter is dropped. */
    apiUrl: function () {
      return 'https://api.openalex.org/works'
        + '?filter=author.id:' + this.OA_AUTHORS.join('|') + ',primary_topic.field.id:fields/26'
        + '&sort=publication_date:desc&per-page=200'
        + '&select=id,doi,title,publication_year,cited_by_count,authorships,primary_location,biblio,primary_topic';
    }
  };
})();
