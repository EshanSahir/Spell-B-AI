import { WordList } from '../types';

export const CURATED_WORD_LISTS: WordList[] = [
  {
    id: 'beginner-foundations',
    title: 'Beginner - Foundations Bee',
    description: 'Essential spelling bee words targeting key silent letters, double consonants, and tricky vowel combinations.',
    difficulty: 'beginner',
    category: 'Foundations',
    words: [
      {
        id: 'b1',
        word: 'acquiescent',
        phonetic: '/æk.wiˈɛs.ənt/',
        definition: 'Ready to accept or agree to something without protest.',
        partOfSpeech: 'adjective',
        origin: 'Latin',
        sampleSentence: 'The acquiescent audience listened attentively to the keynote speaker.',
        syllables: 'ac·qui·es·cent',
        difficulty: 'beginner',
        mnemonic: 'Remember "acquiescent" ends in -ent like client.'
      },
      {
        id: 'b2',
        word: 'boulevard',
        phonetic: '/ˈbʊl.ə.vɑːrd/',
        definition: 'A broad avenue in a city, usually lined with trees.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'We walked down the sunny boulevard lined with palm trees.',
        syllables: 'bou·le·vard',
        difficulty: 'beginner',
        mnemonic: 'Boulevard starts with BOU like bouquet.'
      },
      {
        id: 'b3',
        word: 'camaraderie',
        phonetic: '/ˌkɑːm.əˈrɑː.dɚ.i/',
        definition: 'Mutual trust and friendship among people who spend a lot of time together.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'The team developed a deep camaraderie during the summer training camp.',
        syllables: 'ca·ma·ra·de·rie',
        difficulty: 'beginner',
        mnemonic: 'Contains "comrade" root modified into camaraderie.'
      },
      {
        id: 'b4',
        word: 'guarantee',
        phonetic: '/ˌɡær.ənˈtiː/',
        definition: 'A formal promise that certain conditions will be fulfilled.',
        partOfSpeech: 'noun / verb',
        origin: 'French',
        sampleSentence: 'The appliance comes with a two-year money-back guarantee.',
        syllables: 'guar·an·tee',
        difficulty: 'beginner',
        mnemonic: 'Starts with G-U-A-R like guard.'
      },
      {
        id: 'b5',
        word: 'rhythm',
        phonetic: '/ˈrɪð.əm/',
        definition: 'A strong, regular, repeated pattern of movement or sound.',
        partOfSpeech: 'noun',
        origin: 'Greek',
        sampleSentence: 'The drummer kept a steady rhythm throughout the concert.',
        syllables: 'rhythm',
        difficulty: 'beginner',
        mnemonic: 'Rhythm Has Your Two Hips Moving.'
      },
      {
        id: 'b6',
        word: 'miscellaneous',
        phonetic: '/ˌmɪs.əˈleɪ.ni.əs/',
        definition: 'Consisting of members or elements of different kinds.',
        partOfSpeech: 'adjective',
        origin: 'Latin',
        sampleSentence: 'She stored miscellaneous items in a box on the top shelf.',
        syllables: 'mis·cel·la·ne·ous',
        difficulty: 'beginner',
        mnemonic: 'Mis-cell-an-eous: notice the double L!'
      },
      {
        id: 'b7',
        word: 'silhouette',
        phonetic: '/ˌsɪl.uˈet/',
        definition: 'The dark shape and outline of someone or something visible against a lighter background.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'The mountain silhouette stood out clearly against the sunset sky.',
        syllables: 'sil·hou·ette',
        difficulty: 'beginner',
        mnemonic: 'Sil-hou-ette ends in -ette like cassette.'
      },
      {
        id: 'b8',
        word: 'quarantine',
        phonetic: '/ˈkwɔːr.ən.tiːn/',
        definition: 'A state or period of isolation to prevent the spread of disease.',
        partOfSpeech: 'noun / verb',
        origin: 'Italian',
        sampleSentence: 'The traveler was placed in quarantine for fourteen days.',
        syllables: 'quar·an·tine',
        difficulty: 'beginner',
        mnemonic: 'Derived from Italian quaranta (forty).'
      },
      {
        id: 'b9',
        word: 'handkerchief',
        phonetic: '/ˈhæŋ.kɚ.tʃiːf/',
        definition: 'A square piece of cloth used for wiping one\'s nose or face.',
        partOfSpeech: 'noun',
        origin: 'English',
        sampleSentence: 'He folded his embroidered handkerchief neatly into his pocket.',
        syllables: 'hand·ker·chief',
        difficulty: 'beginner',
        mnemonic: 'Hand + kerchief.'
      },
      {
        id: 'b10',
        word: 'playwright',
        phonetic: '/ˈpleɪ.raɪt/',
        definition: 'A person who writes plays; a dramatist.',
        partOfSpeech: 'noun',
        origin: 'English',
        sampleSentence: 'The famous playwright bowed as the audience applauded.',
        syllables: 'play·wright',
        difficulty: 'beginner',
        mnemonic: 'Wright means craftsman (like wheelwright), spelled W-R-I-G-H-T.'
      },
      {
        id: 'b11',
        word: 'vacuum',
        phonetic: '/ˈvæk.juːm/',
        definition: 'A space entirely devoid of matter, or a device used for cleaning.',
        partOfSpeech: 'noun',
        origin: 'Latin',
        sampleSentence: 'Sound cannot travel through a vacuum.',
        syllables: 'vac·u·um',
        difficulty: 'beginner',
        mnemonic: 'Vacuum has one C and double U!'
      },
      {
        id: 'b12',
        word: 'bureaucracy',
        phonetic: '/bjʊəˈrɒk.rə.si/',
        definition: 'A system of government in which most decisions are made by state officials.',
        partOfSpeech: 'noun',
        origin: 'French / Greek',
        sampleSentence: 'Navigating through government bureaucracy required patience.',
        syllables: 'bu·reau·cra·cy',
        difficulty: 'beginner',
        mnemonic: 'Bureau (b-u-r-e-a-u) + cracy.'
      }
    ]
  },
  {
    id: 'intermediate-etymology',
    title: 'Intermediate - Regional Bee Prep',
    description: 'Challenging words featuring classical Greek & Latin roots, French loanwords, and homophone traps.',
    difficulty: 'intermediate',
    category: 'Etymology & Roots',
    words: [
      {
        id: 'i1',
        word: 'bourgeoisie',
        phonetic: '/ˌbʊər.ʒwɑːˈziː/',
        definition: 'The middle class, typically with reference to its perceived materialistic values.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'The novel satirizes the customs and aspirations of the 19th-century bourgeoisie.',
        syllables: 'bour·geois·ie',
        difficulty: 'intermediate',
        mnemonic: 'Ends with -geoisie (g-e-o-i-s-i-e).'
      },
      {
        id: 'i2',
        word: 'idiosyncrasy',
        phonetic: '/ˌɪd.i.əˈsɪŋ.krə.si/',
        definition: 'A mode of behavior or way of thought peculiar to an individual.',
        partOfSpeech: 'noun',
        origin: 'Greek',
        sampleSentence: 'His habit of tapping his pen three times before answering is an endearing idiosyncrasy.',
        syllables: 'id·i·o·syn·cra·sy',
        difficulty: 'intermediate',
        mnemonic: 'Ends in -crasy (c-r-a-s-y), not -cracy!'
      },
      {
        id: 'i3',
        word: 'pharaoh',
        phonetic: '/ˈfeɪ.roʊ/',
        definition: 'A ruler in ancient Egypt.',
        partOfSpeech: 'noun',
        origin: 'Egyptian / Hebrew / Greek',
        sampleSentence: 'The ancient pyramid was built as a tomb for the ruling pharaoh.',
        syllables: 'pha·raoh',
        difficulty: 'intermediate',
        mnemonic: 'P-H-A-R-A-O-H: A before O (A-O).'
      },
      {
        id: 'i4',
        word: 'quintessential',
        phonetic: '/ˌkwɪn.təˈsen.ʃəl/',
        definition: 'Representing the most perfect or typical example of a quality or class.',
        partOfSpeech: 'adjective',
        origin: 'Latin',
        sampleSentence: 'A red telephone booth is the quintessential symbol of London.',
        syllables: 'quin·tes·sen·tial',
        difficulty: 'intermediate',
        mnemonic: 'Quint-essential: fifth essence.'
      },
      {
        id: 'i5',
        word: 'surveillance',
        phonetic: '/sɚˈveɪ.ləns/',
        definition: 'Close observation, especially of a suspected spy or criminal.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'The museum upgraded its video surveillance system for security.',
        syllables: 'sur·vei·llance',
        difficulty: 'intermediate',
        mnemonic: 'Survei + double L + ance.'
      },
      {
        id: 'i6',
        word: 'reconnaissance',
        phonetic: '/rɪˈkɒn.ə.səns/',
        definition: 'Military observation of a region to locate an enemy or ascertain strategic features.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'The drone completed a aerial reconnaissance mission over the coast.',
        syllables: 're·con·nais·sance',
        difficulty: 'intermediate',
        mnemonic: 'Re-con-nais-sance: double N and double S!'
      },
      {
        id: 'i7',
        word: 'sovereignty',
        phonetic: '/ˈsɒv.rɪn.ti/',
        definition: 'Supreme power or authority; the authority of a state to govern itself.',
        partOfSpeech: 'noun',
        origin: 'French / Latin',
        sampleSentence: 'The nation celebrated fifty years of full political sovereignty.',
        syllables: 'sov·er·eign·ty',
        difficulty: 'intermediate',
        mnemonic: 'Contains sovereign + ty.'
      },
      {
        id: 'i8',
        word: 'liaison',
        phonetic: '/liˈeɪ.zɒn/',
        definition: 'Communication or cooperation which facilitates a close working relationship.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'She served as an effective liaison between the medical staff and families.',
        syllables: 'li·ai·son',
        difficulty: 'intermediate',
        mnemonic: 'Li-ai-son has two I\'s surrounding an A!'
      }
    ]
  },
  {
    id: 'advanced-state-champs',
    title: 'Advanced - State Championship',
    description: 'High-level vocabulary involving French silent letters, German compounds, and Italian terms.',
    difficulty: 'advanced',
    category: 'State Level',
    words: [
      {
        id: 'a1',
        word: 'palaver',
        phonetic: '/pəˈlæv.ɚ/',
        definition: 'Unnecessary elaborate or time-consuming talk or fuss.',
        partOfSpeech: 'noun',
        origin: 'Portuguese',
        sampleSentence: 'Why go through all this palaver when a simple phone call will do?',
        syllables: 'pa·lav·er',
        difficulty: 'advanced',
        mnemonic: 'Derived from Portuguese palavra (word).'
      },
      {
        id: 'a2',
        word: 'succedaneum',
        phonetic: '/ˌsʌk.səˈdeɪ.ni.əm/',
        definition: 'A substitute or replacement for something else, especially a drug.',
        partOfSpeech: 'noun',
        origin: 'Latin',
        sampleSentence: 'Synthetic insulin serves as a life-saving succedaneum for natural insulin.',
        syllables: 'suc·ce·da·ne·um',
        difficulty: 'advanced',
        mnemonic: 'Suc-ce-da-ne-um (double C).'
      },
      {
        id: 'a3',
        word: 'gewgaw',
        phonetic: '/ˈɡjuː.ɡɔː/',
        definition: 'A showy thing that is useless or of little value; a trinket.',
        partOfSpeech: 'noun',
        origin: 'Middle English',
        sampleSentence: 'The souvenir shop was crammed full of cheap gewgaws and plastic keychains.',
        syllables: 'gew·gaw',
        difficulty: 'advanced',
        mnemonic: 'G-E-W + G-A-W.'
      },
      {
        id: 'a4',
        word: 'psittacine',
        phonetic: '/ˈsɪt.ə.saɪn/',
        definition: 'Of or relating to parrots or the parrot family.',
        partOfSpeech: 'adjective / noun',
        origin: 'Greek / Latin',
        sampleSentence: 'The veterinarian specialized in the care of psittacine birds.',
        syllables: 'psit·ta·cine',
        difficulty: 'advanced',
        mnemonic: 'Silent P at start: P-S-I-T-T-A-C-I-N-E.'
      },
      {
        id: 'a5',
        word: 'flibbertigibbet',
        phonetic: '/ˌflɪb.ɚ.tiˈdʒɪb.ɪt/',
        definition: 'A frivolous, flighty, or excessively talkative person.',
        partOfSpeech: 'noun',
        origin: 'Middle English',
        sampleSentence: 'She was affectionately known as a flibbertigibbet who brought endless laughter.',
        syllables: 'flib·ber·ti·gib·bet',
        difficulty: 'advanced',
        mnemonic: 'Flibber-ti-gibbet with double B.'
      },
      {
        id: 'a6',
        word: 'schadenfreude',
        phonetic: '/ˈʃɑː.dənˌfrɔɪ.də/',
        definition: 'Pleasure derived by someone from another person\'s misfortune.',
        partOfSpeech: 'noun',
        origin: 'German',
        sampleSentence: 'Resisting schadenfreude when an opponent falters is a sign of true sportsmanship.',
        syllables: 'scha·den·freu·de',
        difficulty: 'advanced',
        mnemonic: 'Schaden (damage) + Freude (joy).'
      }
    ]
  },
  {
    id: 'championship-scripps',
    title: 'Championship - Scripps National Bee',
    description: 'Supreme-difficulty challenge set featuring obscure biological, medical, geological, and rare loan words.',
    difficulty: 'championship',
    category: 'National Championship',
    words: [
      {
        id: 'c1',
        word: 'autochthonous',
        phonetic: '/ɔːˈtɒk.θə.nəs/',
        definition: 'Inhabiting or existing in the land from the earliest times; indigenous.',
        partOfSpeech: 'adjective',
        origin: 'Greek',
        sampleSentence: 'The flora of Hawaii contains many autochthonous plant species found nowhere else.',
        syllables: 'au·toch·tho·nous',
        difficulty: 'championship',
        mnemonic: 'Auto-chthonous: Greek root chthon (earth).'
      },
      {
        id: 'c2',
        word: 'ptarmigan',
        phonetic: '/ˈtɑːr.mɪ.ɡən/',
        definition: 'A northern grouse of mountainous and arctic regions with feathered toes.',
        partOfSpeech: 'noun',
        origin: 'Scottish Gaelic',
        sampleSentence: 'In winter, the ptarmigan sheds its brown feathers for a pure white plumage.',
        syllables: 'ptar·mi·gan',
        difficulty: 'championship',
        mnemonic: 'Silent initial P: P-T-A-R-M-I-G-A-N.'
      },
      {
        id: 'c3',
        word: 'synecdoche',
        phonetic: '/sɪˈnɛk.də.ki/',
        definition: 'A figure of speech in which a part is made to represent the whole or vice versa.',
        partOfSpeech: 'noun',
        origin: 'Greek',
        sampleSentence: 'Using "all hands on deck" to mean "all sailors" is a classic example of synecdoche.',
        syllables: 'syn·ec·do·che',
        difficulty: 'championship',
        mnemonic: 'Syn-ec-do-che: ends in -che pronounced /ki/.'
      },
      {
        id: 'c4',
        word: 'logorrhea',
        phonetic: '/ˌlɒɡ.əˈriː.ə/',
        definition: 'A tendency to extreme loquacity or wordiness.',
        partOfSpeech: 'noun',
        origin: 'Greek',
        sampleSentence: 'The politician was criticized for his logorrhea during the press conference.',
        syllables: 'log·or·rhe·a',
        difficulty: 'championship',
        mnemonic: 'Logos (word) + rhea (flow, double R).'
      },
      {
        id: 'c5',
        word: 'bougainvillea',
        phonetic: '/ˌbuː.ɡənˈvɪl.i.ə/',
        definition: 'An ornamental tropical climbing plant with bright magenta or purple bracts.',
        partOfSpeech: 'noun',
        origin: 'French',
        sampleSentence: 'Vibrant pink bougainvillea draped gracefully over the stone archway.',
        syllables: 'bou·gain·vil·le·a',
        difficulty: 'championship',
        mnemonic: 'Bou-gain-vil-le-a with double L.'
      },
      {
        id: 'c6',
        word: 'psammon',
        phonetic: '/ˈsæm.ɒn/',
        definition: 'Organisms living among beach sand grains.',
        partOfSpeech: 'noun',
        origin: 'Greek',
        sampleSentence: 'Biologists studied microscopic psammon collected along the intertidal shoreline.',
        syllables: 'psam·mon',
        difficulty: 'championship',
        mnemonic: 'Silent initial P: P-S-A-M-M-O-N.'
      }
    ]
  }
];

