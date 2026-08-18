export type MusicCategory = "classical" | "non-classical";
export type MusicSubCategory = "symphonies" | "operas" | "concertos" | "others";
export type AlbumType = "studio" | "live";

export interface Album {
  slug: string;
  title: string;
  artist: string;
  category: MusicCategory;
  subCategory?: MusicSubCategory;
  description: string;
  details: string;
  recommendation: string;
  conductor?: string;
  orchestra?: string;
  soloist?: string;
  vocalists?: string;
  releaseDate?: string;
  catalogNumber?: string;
  albumType?: AlbumType;
  cover?: string;
  listenUrl?: string;
}

export const albums: Album[] = [
  // symphonies
  {
    cover: "/covers/music-covers/celibidache_bruckner_symphony_No.4.jpg",
    slug: "bruckner-symphony-4",
    title: 'Symphony No. 4 "Romantic"',
    artist: "Anton Bruckner",
    category: "classical",
    subCategory: "symphonies",
    description:
      "This album features Celibidache conducting the Münchner Philharmoniker in Bruckner’s Symphony No. 4 “Romantic,” recorded live on October 16, 1988, at the Philharmonie im Gasteig in Munich and released by EMI Classics. Celibidache’s interpretation is renowned for its unusually broad tempos, rich string sonority, and deeply meditative approach. This live recording faithfully preserves the distinctive sound cultivated through his long collaboration with the orchestra, and it is widely hailed by critics as a benchmark among Bruckner symphony recordings.performed works in the classical canon.",
    details:
      "This album features Celibidache conducting the Münchner Philharmoniker in Bruckner’s Symphony No. 4 “Romantic,” recorded live on October 16, 1988, at the Philharmonie im Gasteig in Munich and released by EMI Classics. Celibidache’s interpretation is renowned for its unusually broad tempos, rich string sonority, and deeply meditative approach. This live recording faithfully preserves the distinctive sound cultivated through his long collaboration with the orchestra, and it is widely hailed by critics as a benchmark among Bruckner symphony recordings.",
    recommendation:
      "Best of Bruckner.",
    conductor: "Sergiu Celibidache",
    orchestra: "Münchner Philharmoniker",
    releaseDate: "1998",
    catalogNumber: "5566902",
    albumType: "live",
    listenUrl: "https://music.163.com/#/album?id=78513193",
  },
  {
    cover: "/covers/music-covers/mravinsky_tchaikovsky_symphony4-6.jpg",
    slug: "tchaikovsky-symphony-4-6",
    title: 'Symphonies Nos. 4~6',
    artist: "Pyotr Ilyich Tchaikovsky",
    category: "classical",
    subCategory: "symphonies",
    description:
      "The recording of Tchaikovsky’s Symphonies Nos. 4, 5, and 6 by Mravinsky and the Leningrad Philharmonic stands as a monument in the history of classical recordings. Made for Deutsche Grammophon in 1960, this interpretation has remained unrivaled for over half a century. Mravinsky’s razor-sharp rhythms and searing emotional intensity bring out every shade of anguish, despair, and tragic grandeur in Tchaikovsky’s score. The Leningrad orchestra delivers a sonority of immense weight—strings thick as iron curtains, brass piercing and biting—creating a cold, steely power reminiscent of the far north. Reissued in DG’s “The Originals” series with remastered sound, this set is an indispensable treasure for every classical music lover.",
    details:
      "This album features Celibidache conducting the Münchner Philharmoniker in Bruckner’s Symphony No. 4 “Romantic,” recorded live on October 16, 1988, at the Philharmonie im Gasteig in Munich and released by EMI Classics. Celibidache’s interpretation is renowned for its unusually broad tempos, rich string sonority, and deeply meditative approach. This live recording faithfully preserves the distinctive sound cultivated through his long collaboration with the orchestra, and it is widely hailed by critics as a benchmark among Bruckner symphony recordings.",
    recommendation:
      "Where the dream begin.",
    conductor: "Yevgeny Mravinsky",
    orchestra: "Leningrad Philharmonic Orchestra",
    releaseDate: "2006",
    catalogNumber: "4775911",
    albumType: "studio",
    listenUrl: "https://music.163.com/#/album?id=212267",
  },
  {
    cover: "/covers/music-covers/s_bruckner_symphony_No.5.jpg",
    slug: "bruckner-symphony-5",
    title: "Symphony No.5",
    artist: "Anton Bruckner",
    category: "classical",
    subCategory: "symphonies",
    description:
      "On October 31, 2015, at London’s Royal Festival Hall, the ninety-two-year-old Polish conductor Stanisław Skrowaczewski stepped onto the podium of the London Philharmonic Orchestra and delivered this live recording of Bruckner’s Symphony No. 5. A renowned Bruckner specialist, Skrowaczewski brings profound insight to this symphony, which Bruckner himself called his “masterpiece of counterpoint”. He employs the Nowak 1878 edition of the score, which largely represents the composer’s original intentions. From the monumental opening of the first movement, through the deep emotional expanse of the Adagio, to the triumphant fugal finale, the performance exudes a humility and serenity born of a lifetime of musical wisdom. The London Philharmonic responds with playing of the highest calibre—brass delivering dark, threatening roars, woodwind assured and refined, strings gleaming with a splendid silvery timbre. Classical Source noted “a strong and palpable connection between maestro and musicians” throughout this impressive account. Released on the LPO’s own label (LPO0090), this recording stands as a precious testament to Skrowaczewski’s late-career Bruckner artistry.",
    details:
      "On October 31, 2015, at London’s Royal Festival Hall, the ninety-two-year-old Polish conductor Stanisław Skrowaczewski stepped onto the podium of the London Philharmonic Orchestra and delivered this live recording of Bruckner’s Symphony No. 5. A renowned Bruckner specialist, Skrowaczewski brings profound insight to this symphony, which Bruckner himself called his “masterpiece of counterpoint”. He employs the Nowak 1878 edition of the score, which largely represents the composer’s original intentions. From the monumental opening of the first movement, through the deep emotional expanse of the Adagio, to the triumphant fugal finale, the performance exudes a humility and serenity born of a lifetime of musical wisdom. The London Philharmonic responds with playing of the highest calibre—brass delivering dark, threatening roars, woodwind assured and refined, strings gleaming with a splendid silvery timbre. Classical Source noted “a strong and palpable connection between maestro and musicians” throughout this impressive account. Released on the LPO’s own label (LPO0090), this recording stands as a precious testament to Skrowaczewski’s late-career Bruckner artistry.",
    recommendation:
      "Cathedral-like.",
    conductor: "Stanislaw Skrowaczewski",
    orchestra: "London Philharmonic Orchestra",
    releaseDate: "2016",
    catalogNumber: "LPO0090D",
    albumType: "live",
    listenUrl:
      "https://music.163.com/#/album?id=79384727"
  },
  {
    cover: "/covers/music-covers/sanderling_bruckner_symphony_No.7.jpg",
    slug: "bruckner-symphony-7",
    title: "Symphony No.7",
    artist: "Anton Bruckner",
    category: "classical",
    subCategory: "symphonies",
    description:
      "Kurt Sanderling’s recording of Bruckner’s Symphony No. 7 with the Stuttgart Radio Symphony Orchestra stands as a late-career artistic testament. Recorded live in 1999 at the Liederhalle in Stuttgart, the eighty-three-year-old conductor poured a lifetime’s wisdom into this performance, achieving a Zen-like serenity in his pacing. Employing the Haas edition, he unfolds Bruckner’s long-breathed lines with breadth and stability—the first movement’s main theme rises like morning mist, while the famous Adagio is rendered with solemn dignity and profound sorrow. The Stuttgart orchestra plays with solid warmth, and the brass erupts in radiant splendour at the climaxes. Reissued on the SWR Classic label, this disc is a treasured document of Sanderling’s later Bruckner, hailed by critics as “a great and convincing interpretation.”",
    details:
      "Kurt Sanderling’s recording of Bruckner’s Symphony No. 7 with the Stuttgart Radio Symphony Orchestra stands as a late-career artistic testament. Recorded live in 1999 at the Liederhalle in Stuttgart, the eighty-three-year-old conductor poured a lifetime’s wisdom into this performance, achieving a Zen-like serenity in his pacing. Employing the Haas edition, he unfolds Bruckner’s long-breathed lines with breadth and stability—the first movement’s main theme rises like morning mist, while the famous Adagio is rendered with solemn dignity and profound sorrow. The Stuttgart orchestra plays with solid warmth, and the brass erupts in radiant splendour at the climaxes. Reissued on the SWR Classic label, this disc is a treasured document of Sanderling’s later Bruckner, hailed by critics as “a great and convincing interpretation.”",
    recommendation:
      "The most touching.",
    conductor: "Kurt Sanderling",
    orchestra: "SWR Symphonieorchester",
    releaseDate: "2018",
    catalogNumber: "SWR19410CD",
    albumType: "live",
    listenUrl:
      "https://music.163.com/#/album?id=349326612"
  },
  {
    cover: "/covers/music-covers/giulini_bruckner_symphony_No.9.jpg",
    slug: "bruckner-symphony-9",
    title: "Symphony No.9",
    artist: "Anton Bruckner",
    category: "classical",
    subCategory: "symphonies",
    description:
      "To listen to Giulini and the Vienna Philharmonic in Bruckner’s Ninth is to step inside a cathedral built of sound. Captured live at the Musikverein in June 1988, this recording finds the Italian maestro in his late maturity, distilling a lifetime of musical wisdom into one of the most profound statements ever committed to disc. Extremely slow tempos—the opening bars alone signal an uncommon pilgrimage—allow the Viennese strings, with their velvety warmth, to unfold Bruckner’s unfinished farewell with aching tenderness. Giulini shuns dramatic outbursts, instead letting each harmony resonate, fade, and slowly coalesce into the next beam of light. The Scherzo pounds like the heartbeat of a giant, while the twenty-five-minute finale ascends through ruptures toward a transcendent serenity. Reissued in DG’s “The Originals” series, this recording stands among the supreme interpretations of Bruckner’s final symphony.",
    details:
      "To listen to Giulini and the Vienna Philharmonic in Bruckner’s Ninth is to step inside a cathedral built of sound. Captured live at the Musikverein in June 1988, this recording finds the Italian maestro in his late maturity, distilling a lifetime of musical wisdom into one of the most profound statements ever committed to disc. Extremely slow tempos—the opening bars alone signal an uncommon pilgrimage—allow the Viennese strings, with their velvety warmth, to unfold Bruckner’s unfinished farewell with aching tenderness. Giulini shuns dramatic outbursts, instead letting each harmony resonate, fade, and slowly coalesce into the next beam of light. The Scherzo pounds like the heartbeat of a giant, while the twenty-five-minute finale ascends through ruptures toward a transcendent serenity. Reissued in DG’s “The Originals” series, this recording stands among the supreme interpretations of Bruckner’s final symphony.",
    recommendation:
      "Grand and restrained.",
    conductor: "Carlo Maria Giulini",
    orchestra: "Wiener Philharmoniker",
    releaseDate: "1989",
    catalogNumber: "E4273452",
    albumType: "live",
    listenUrl:
      "https://music.163.com/#/album?id=246449352"
  },
  {
    cover: "/covers/music-covers/kleiber_beethoven_symphony5&7.jpg",
    slug: "bruckner-symphony-9",
    title: "Symphonies Nos.5&7",
    artist: "Ludwig van Beethoven",
    category: "classical",
    subCategory: "symphonies",
    description:
      "This recording is nothing short of a legend in classical music history.",
    details:
      "Carlos Kleiber leads the Wiener Philharmoniker in Beethoven’s Symphonies Nos. 5 & 7, recorded for Deutsche Grammophon in 1975 and 1976. It is perhaps the only disc ever to have simultaneously earned a place on five of the most prestigious classical music lists: Penguin Guide’s Rosette, Record Geijutsu’s Best 300, Gramophone’s 100 Greatest, DG’s 100, and Classic CD’s 100. Kleiber’s interpretation strikes a perfect balance between precision and beauty, with his conducting flowing so organically that the music seems to breathe and move on its own. The total playing time is approximately 72 minutes. Though Kleiber’s exclusive contract with DG ended in 1981 and he virtually ceased making new recordings thereafter, this disc became an eternal classic, hailed by countless music lovers as the one album you must own if your CD collection could have only a single entry.",
    recommendation:
      "One of my first CDs.",
    conductor: "Carlos Kleiber",
    orchestra: "Wiener Philharmoniker",
    releaseDate: "1995",
    catalogNumber: "447 400-2",
    albumType: "studio",
    listenUrl:
      "https://music.163.com/#/album?id=152843763",
  },

  // operas
  {
    cover: "/covers/music-covers/kleiber_strauss_der_rosenkavalier.webp",
    slug: "strauss-der-rosenkavalier",
    title: "Der Rosenkavalier",
    artist: "Richard Strauss",
    category: "classical",
    subCategory: "operas",
    description:
      "Carlos Kleiber conducted Der Rosenkavalier in the most famous opera houses all over the world, but nowhere as much as at the Bavarian State Opera in Munich. These performances justifiably remain in the audiences' memory, as proven by this recording of a 1973 festival performance. A year after the première of this Munich production, the performances had become that of a perfect ensemble: the different vocal characteristics of the various singing personalities also inspired Kleiber to bring to light other details of the score: the blackness and the seriousness of the bass Karl Ridderbusch as Baron Ochs is made all the more intense by the almost threatening quality of the orchestra, and even more refreshing by the purposefully performed comic punchlines; the wise melancholy of the Marschallin is celebrated by Claire Watson and Carlos Kleiber with equally shadowed quality and accentuation; the vocal freshness and natural impetuosity of Lucia Popp as Sophie and Brigitte Fassbaender in the title-role match Carlos Kleiber's direction in its unrestrained vigour.",
    details:
      "Carlos Kleiber conducted Der Rosenkavalier in the most famous opera houses all over the world, but nowhere as much as at the Bavarian State Opera in Munich. These performances justifiably remain in the audiences' memory, as proven by this recording of a 1973 festival performance. A year after the première of this Munich production, the performances had become that of a perfect ensemble: the different vocal characteristics of the various singing personalities also inspired Kleiber to bring to light other details of the score: the blackness and the seriousness of the bass Karl Ridderbusch as Baron Ochs is made all the more intense by the almost threatening quality of the orchestra, and even more refreshing by the purposefully performed comic punchlines; the wise melancholy of the Marschallin is celebrated by Claire Watson and Carlos Kleiber with equally shadowed quality and accentuation; the vocal freshness and natural impetuosity of Lucia Popp as Sophie and Brigitte Fassbaender in the title-role match Carlos Kleiber's direction in its unrestrained vigour.",
    recommendation:
      "My first Opera.",
    conductor: "Carlos Kleiber",
    orchestra: "Bayerische Staatsoper",
    vocalists: "Brigitte Fassbaender / Claire Watson / Karl Ridderbusch / ...",
    releaseDate: "1973",
    albumType: "live",
    listenUrl: "https://www.prestomusic.com/classical/products/7951703--strauss-r-der-rosenkavalier"
  },
  {
    cover: "/covers/music-covers/kempe_wagner_lohengrin.jpg",
    slug: "wagner-lohengrin",
    title: "Lohengrin",
    artist: "Richard Wagner",
    category: "classical",
    subCategory: "operas",
    description:
      "Praised as much for its visionary intensity as for its vivid sense of theatre, this Lohengrin, conducted by Rudolf Kempe and recorded in Vienna, unites an exceptional cast: Jess Thomas in the title role, both idealised hero and vulnerable man; the radiant Elisabeth Grümmer as Elsa and, as Ortrud and Telramund, Christa Ludwig and Dietrich Fischer-Dieskau, subtly bringing extra dimensions to the two villains of the piece.",
    details:
      "Praised as much for its visionary intensity as for its vivid sense of theatre, this Lohengrin, conducted by Rudolf Kempe and recorded in Vienna, unites an exceptional cast: Jess Thomas in the title role, both idealised hero and vulnerable man; the radiant Elisabeth Grümmer as Elsa and, as Ortrud and Telramund, Christa Ludwig and Dietrich Fischer-Dieskau, subtly bringing extra dimensions to the two villains of the piece.",
    recommendation:
      "My favourite Wagner.",
    conductor: "Rudolf Kempe",
    orchestra: "Wiener Philharmoniker",
    vocalists: "Jess Thomas / Christa Ludwig / Gootlob Frick / ...",
    albumType: "live",
    listenUrl: "https://www.prestomusic.com/classical/products/8080804--wagner-lohengrin",
  },
  {
    cover: "/covers/music-covers/barenboim_wagner_nibelungen.jpg",
    slug: "wagner-nibelungen",
    title: "Der Ring des Nibelungen",
    artist: "Richard Wagner",
    category: "classical",
    subCategory: "operas",
    description:
      "Daniel Barenboim’s recording of Wagner’s Der Ring des Nibelungen from the Bayreuth Festival is one of the most celebrated complete cycles ever committed to disc. Captured live over the 1991 and 1992 festivals at the legendary Bayreuth Festspielhaus—the opera house Wagner built for his own visionary works—this production, staged and directed by Harry Kupfer, had matured over five years before being recorded. Barenboim conducts the Bayreuth Festival Orchestra with what Gramophone called “Furtwänglerian virtuosity,” manipulating tempo and orchestral colour with a theatrical instinct perfectly attuned to the stage drama. The cast is exceptional: John Tomlinson’s commanding Wotan, Anne Evans’s radiant Brünnhilde, and Siegfried Jerusalem’s heroic Siegfried lead a formidable ensemble that also includes Graham Clark’s cunning Loge and Waltraud Meier’s searing Waltraute. Hugh Canning of BBC Music Magazine declared it “the most compelling of modern recorded Rings”, while The Observer called it “perhaps the best on disc”. Released by Warner Classics in multiple formats—CD, DVD, and Blu-ray—this monumental recording remains a touchstone for anyone seeking Wagner’s epic drama in its fullest, most electrifying form.",
    details:
      "Daniel Barenboim’s recording of Wagner’s Der Ring des Nibelungen from the Bayreuth Festival is one of the most celebrated complete cycles ever committed to disc. Captured live over the 1991 and 1992 festivals at the legendary Bayreuth Festspielhaus—the opera house Wagner built for his own visionary works—this production, staged and directed by Harry Kupfer, had matured over five years before being recorded. Barenboim conducts the Bayreuth Festival Orchestra with what Gramophone called “Furtwänglerian virtuosity,” manipulating tempo and orchestral colour with a theatrical instinct perfectly attuned to the stage drama. The cast is exceptional: John Tomlinson’s commanding Wotan, Anne Evans’s radiant Brünnhilde, and Siegfried Jerusalem’s heroic Siegfried lead a formidable ensemble that also includes Graham Clark’s cunning Loge and Waltraud Meier’s searing Waltraute. Hugh Canning of BBC Music Magazine declared it “the most compelling of modern recorded Rings”, while The Observer called it “perhaps the best on disc”. Released by Warner Classics in multiple formats—CD, DVD, and Blu-ray—this monumental recording remains a touchstone for anyone seeking Wagner’s epic drama in its fullest, most electrifying form.",
    recommendation:
      "The longest opera in the world.",
    conductor: "Daniel Barenboim",
    vocalists: "John Tomlinson / Günter von Kannen / Bodo Brinkmann",
    orchestra: "Chor und Orchester der Bayreuther Festspiele",
    albumType: "live",
    listenUrl: "https://www.prestomusic.com/classical/products/7936843--wagner-der-ring-des-nibelungen",
  },

  // concertos
  
  // others
  {
    cover: "/covers/music-covers/barbirolli_sibelius_set.jpg",
    slug: "sibelius-box",
    title: "Sibelius's Box",
    artist: "Christian Sibelius",
    category: "classical",
    subCategory: "others",
    description:
      "An early champion of Sibelius’s music, Barbirolli and his Hallé Orchestra—which he had painstakingly built up over decades—set down this celebrated cycle between 1966 and 1970. His interpretations are charged with “electrifying” intensity and hailed as “stunning”; the composer himself declared Barbirolli a “devoted admirer”.",
    details:
      "An early champion of Sibelius’s music, Barbirolli and his Hallé Orchestra—which he had painstakingly built up over decades—set down this celebrated cycle between 1966 and 1970. His interpretations are charged with “electrifying” intensity and hailed as “stunning”; the composer himself declared Barbirolli a “devoted admirer”.",
    recommendation:
      "Best of Sibelius.",
    conductor: "Sir John Barbirolli",
    orchestra: "Hallé Orchestra",
    releaseDate: "2021",
    listenUrl: "https://music.163.com/#/album?id=124576013",
  },
  {
    cover: "/covers/music-covers/klemperer_mahler_set.jpg",
    slug: "mahler-box",
    title: "Mahler's Box",
    artist: "Gustav Mahler.",
    category: "classical",
    subCategory: "others",
    description:
      "As a protégé of Gustav Mahler himself，Otto Klemperer's profound personal connection to this music makes him its quintessential interpreter. This Warner Classics edition gathers all of his Mahler recordings for EMI, made between 1961 and 1967. The 7-CD set includes the Second (“Resurrection”), Fourth, Seventh, and Ninth Symphonies, along with Das Lied von der Erde. These performances, renowned for their “big outlines” and “rock-like rhythm”, have become legendary. While critics note that not every reading is flawless, Klemperer invariably offers profound insights into the music. His accounts of the Ninth Symphony and Das Lied von der Erde, in particular, are universally hailed as timeless classics of the gramophone.",
    details:
      "As a protégé of Gustav Mahler himself，Otto Klemperer's profound personal connection to this music makes him its quintessential interpreter. This Warner Classics edition gathers all of his Mahler recordings for EMI, made between 1961 and 1967. The 7-CD set includes the Second (“Resurrection”), Fourth, Seventh, and Ninth Symphonies, along with Das Lied von der Erde. These performances, renowned for their “big outlines” and “rock-like rhythm”, have become legendary. While critics note that not every reading is flawless, Klemperer invariably offers profound insights into the music. His accounts of the Ninth Symphony and Das Lied von der Erde, in particular, are universally hailed as timeless classics of the gramophone.",
    recommendation:
      "Best of Mahler.",
    orchestra: "New Philharmonia Orchestra",
    releaseDate: "2024",
    listenUrl: "https://music.163.com/#/album?id=188698210",
  },
  {
    cover: "/covers/music-covers/karajan_strauss.jpg",
    slug: "strauss",
    title: "Also Sprach Zarathustra",
    artist: "Richard Strauss",
    category: "classical",
    subCategory: "others",
    description:
      "Karajan and the Berlin Philharmonic’s 1973–74 recording of Strauss’s Also sprach Zarathustra is the definitive account of this monumental tone poem. The famous “sunrise” opening is just the beginning—Karajan shapes the entire work with architectural grandeur and philosophical depth, while the Berliners deliver their signature golden sound: lustrous strings, blazing brass, and breathtaking orchestral colours. Paired on DG with Don Juan or Till Eulenspiegel, this disc remains a Penguin Guide three-star favourite and one of the landmark recordings of the 1970s.",
    details:
      "Karajan and the Berlin Philharmonic’s 1973–74 recording of Strauss’s Also sprach Zarathustra is the definitive account of this monumental tone poem. The famous “sunrise” opening is just the beginning—Karajan shapes the entire work with architectural grandeur and philosophical depth, while the Berliners deliver their signature golden sound: lustrous strings, blazing brass, and breathtaking orchestral colours. Paired on DG with Don Juan or Till Eulenspiegel, this disc remains a Penguin Guide three-star favourite and one of the landmark recordings of the 1970s.",
    recommendation:
      "One of my first CDs.",
    releaseDate: "1995",
    listenUrl: "https://music.163.com/#/album?id=1677976",
  },
  
  // non-classical
  {
    cover: "/covers/music-covers/transfer_steve_chou.jpg",
    slug: "transfer-steve-chou",
    title: "Transfer",
    artist: "Steve Chou",
    category: "non-classical",
    description:
      "Transfer is the ninth studio album by Taiwanese singer-songwriter Steve Chou, released in 2000. It marks a turning point in his career, as he shed his earlier idol persona 'Xiao Gang' and stepped into the role of a mature composer-producer. The album includes his own renditions of hits he originally wrote for other artists—such as Na Ying and Kelly Chen—alongside the enduring classic 'Dusk' (Huáng Hūn), which remains one of his most beloved signatures.",
    details:
      "Transfer is the ninth studio album by Taiwanese singer-songwriter Steve Chou, released in 2000. It marks a turning point in his career, as he shed his earlier idol persona 'Xiao Gang' and stepped into the role of a mature composer-producer. The album includes his own renditions of hits he originally wrote for other artists—such as Na Ying and Kelly Chen—alongside the enduring classic 'Dusk' (Huáng Hūn), which remains one of his most beloved signatures.",
    recommendation:
      "黄昏、记事本、啤酒泡泡",
    releaseDate: "2000",
    albumType: "studio",
    listenUrl: "https://music.163.com/#/album?id=19203",
  },
  {
    cover: "/covers/music-covers/xingkong_steve_chou.jpg",
    slug: "xingkong-steve-chou",
    title: "星空下的传说",
    artist: "Steve Chou",
    category: "non-classical",
    description:
      "The Legend Underneath the Starry Sky (2005) is Steve Chou's most personal album, inspired by a childhood memory of Yunnan's vast night sky. It features 7 new originals alongside 7 of his own reworked hits for other artists, including the title track and 'Lonely Sandbar in the Cold'.",
    details:
      "The Legend Underneath the Starry Sky (2005) is Steve Chou's most personal album, inspired by a childhood memory of Yunnan's vast night sky. It features 7 new originals alongside 7 of his own reworked hits for other artists, including the title track and 'Lonely Sandbar in the Cold'.",
    recommendation:  
      "寂寞沙洲冷",
    albumType: "studio",
    releaseDate: "2005",
    listenUrl: "https://music.163.com/#/album?id=19174",
  },
  {
    cover: "/covers/music-covers/xintailuan_steve_chou.jpg",
    slug: "xintailuan-steve-chou",
    title: "我的心太乱",
    artist: "Steve Chou",
    category: "non-classical",
    description:
      "My Heart Is So Messy (1996) was Steve Chou's final album under the name 'Xiao Gang' before his transition to his real name. It features the hit title track and the enduring favourite 'Warm Breeze'.",
    details:
      "My Heart Is So Messy (1996) was Steve Chou's final album under the name 'Xiao Gang' before his transition to his real name. It features the hit title track and the enduring favourite 'Warm Breeze'.",
    recommendation:
      "我的心太乱",
    albumType: "studio",
    releaseDate: "1997",
    listenUrl: "https://music.163.com/#/album?id=20147",
  },
  {
    cover: "/covers/music-covers/niannian_steve_chou.jpg",
    slug: "niannian-steve-chou",
    title: "念念不忘",
    artist: "Steve Chou",
    category: "non-classical",
    description:
      "Lingering (2022) is Steve Chou's 18th studio album and his first in eight years. Featuring 12 tracks that blend EDM, folk, classical strings, and his signature “light Chinese style”, the album reflects on the friendships and creative passion that have sustained him throughout his journey.",
    details:
      "Lingering (2022) is Steve Chou's 18th studio album and his first in eight years. Featuring 12 tracks that blend EDM, folk, classical strings, and his signature “light Chinese style”, the album reflects on the friendships and creative passion that have sustained him throughout his journey.",
    recommendation:
      "latest",
    albumType: "studio",
    releaseDate: "2022",
    listenUrl: "https://music.163.com/#/album?id=169117925",
  }
];
