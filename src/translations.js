import { initTranslations, setLanguage } from '@sangre-fp/i18n'
setLanguage(document.querySelector('html').getAttribute('lang'))

const localTranslations = {
    hiddenPhenomena_RatingResults: {
      en:`Hidden phenomena`,
      fi:`Piilotetut ilmiöt`
    },
    hiddenPhenomenaDescription_RatingResults: {
      en:`You can toggle the visibility of a phenomenon for other users by pressing the eye icon.`,
      fi:`Voit vaihtaa ilmiön näkyvyyttä muille käyttäjille painamalla silmäkuvaketta.`
    },
    HideTitles_RatingResults: {
      en: 'Hide titles',
      fi: 'Piilota otsikot'
    },    
    ShowResultsAs_RatingResults: {
      en: 'Mode:',
      fi: 'Sijoittelu:'
    },
    Average_RatingResults: {
      en: 'Average',
      fi: 'Keskiarvo'
    },
    Median_RatingResults: {
      en: 'Median',
      fi: 'Mediaani'
    },
    ClearRatings_RatingResults: {
      en:'Clear Ratings',
      fi: 'Tyhjennä arviot'
    },
    RatingResultsTitle: {
      en: 'Rating results',
      fi: 'Arvioinnin tulokset'
    },
    InfoIconHoverRating: {
      en:`More information on Rating results view`,
      fi:`Lisää tietoa arvioinnin tulosnäkymästä`
  },
  InfoModalRatingNote: {
    en:`The Rating results view consists of two main sections: the fourfold table that shows the results in 2-by-2 matrix, and a list for both axes. You can review the content cards by clicking the dots / titles.`,
    fi: `Arvioinnin tulosnäkymä koostuu kahdesta osiosta: nelikentästä ja kumpaakin arviointiakselia edustavasta listasta.`
  },
  InfoModalRatingNote2: {
    en:`In the fourfold table you can select how to visualise the results:`,
    fi: `Nelikentässä voit säätää tulosten esitystapaa:`
  },

  InfoModalRatingContent: {
    en:`
    After activating the Rating tool, anyone with access to the radar can rate on the content cards.`,
    fi:`
    Aktivoituasi arvioinnin kaikki, joilla on pääsy kartalle, voivat arvioida ennakointikartalla olevaa sisältöä.`
  },
  InfoModalRatingContent2: {
    en:`
    Activating Rating tool activates two 'axis sliders' on each content card.`,
    fi:`
    Arvioinnissa jokaiselle sisältökortille ilmestyy kaksi liukusäädintä.`
  },
  InfoModalRatingContent3: {
    en:`
    Access some of the most commonly used axis from the dropdown menu, and/or fill in custom axis names manually.`,
    fi:`
    Voit hyödyntää pudostusvalikosta löytyviä usein käytettyjä akseleita ja/tai voit nimetä akselit vapaasti itse.`
  },
  InfoModalRatingContent4: {
    en:`
      After the rating activity, results can be found by clicking the centre of the radar.`,
    fi:`
    Arvioinnin jälkeen löydät arvioinnin tulokset painamalla kartan keskustaa.`
  },
  InfoModalRatingContent5: {
    en:`
    A summary of ratings can be exported from the results view.
    `,
    fi:`
    Arviointi-sivulta voit ladata arviointien yhteenvedon jatkohyödyntämistä varten.`
  },
  InfoModalRatingContent6: {
    en:`
    Remember to Save your settings after you have made changes. If you wish to discard the changes you made, click Cancel.
    `,
    fi:`
    Muistathan tallentaa tekemäsi valinnat. Mikäli haluat poistua tallentamatta, paina Peruuta.
    `
  },
  LearnMoreRatingBtn: {
    en:`How the Rating system works in Futures Platform?`,
    fi: `How the Rating system works in Futures Platform?`
  },
  GuideRatingBtn: {
    en:`How to organise a Rating session in practise, and why?`,
    fi: `How to organise a Rating session in practise, and why?`
  },
  RatingTool: {
    en:`Rating tool`,
    fi: `Arviointi`
  },
  GotItBtn: {
    en:`GOT IT`,
    fi: `OK`
  },
}

initTranslations(localTranslations);
