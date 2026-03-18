import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.exercise.deleteMany({})
  await prisma.day.deleteMany({})
  await prisma.weekSchedule.deleteMany({})

  await prisma.weekSchedule.create({
    data: {
      name: 'Raspored treninga',
      days: {
        create: [
          {
            name: 'Push',
            weekDay: 0,
            exercises: {
              create: [
                {
                  name: 'Flat dumbbell bench press',
                  description:
                    'Legni na ravnu klupu, uzmi bučice u svake ruke, spusti ih do visine grudi sa laktovima pod 45°, pa potisni gore do potpunog ispružanja ruku. Fokus na grudni mišić.',
                  setsReps: '3 serije — 6 / 8 / 10',
                  imageUrl: '/exercises/flat-dumbbell-bench-press.png',
                  order: 0,
                },
                {
                  name: 'Machine chest press',
                  description:
                    'Sedi na mašinu za grudi, podesi sedište da su ručke na visini grudi, potisni prema napred do ispružanja, polako vrati nazad. Leđa prislonjena uz naslon.',
                  setsReps: '2 serije — 10 / 10',
                  imageUrl: '/exercises/machine-chest-press.png',
                  order: 1,
                },
                {
                  name: 'Incline db fly',
                  description:
                    'Legni na klupu pod nagibom (~30-45°), uzmi bučice, ispruži ruke gore pa ih spuštaj u luk prema dole (kao da zagrliš drvo), oseti istezanje grudi, vrati u početni položaj.',
                  setsReps: '2 serije — 6-8 / 10-12',
                  imageUrl: '/exercises/incline-db-fly.png',
                  order: 2,
                },
                {
                  name: 'Tricep cable pushdown',
                  description:
                    'Stani ispred kablovske mašine, uzmi šipku odozgo, laktovi priljubljeni uz telo, pritisni šipku prema dole do potpunog ispružanja ruku, polako vrati gore.',
                  setsReps: '2 serije — 10',
                  imageUrl: '/exercises/tricep-cable-pushdown.png',
                  order: 3,
                },
                {
                  name: 'Rope behind the head',
                  description:
                    'Okreni se leđima prema kablovu koji je nisko postavljen, uzmi uže objema rukama iza glave, laktovi uz glavu, ispruži ruke prema gore i napred, vrati polako.',
                  setsReps: '2 serije — 10',
                  imageUrl: '/exercises/rope-behind-the-head.png',
                  order: 4,
                },
                {
                  name: 'Side fly machine',
                  description:
                    'Sedi na mašinu za bočne deltoidne mišiće, podlaktice na jastučiće, podižeš ruke u stranu do visine ramena, polako spuštaš. Izolira srednji deo ramena.',
                  setsReps: '4 serije + drop set na kraju',
                  imageUrl: '/exercises/side-fly-machine.png',
                  order: 5,
                },
                {
                  name: 'Hanging leg raises (abs)',
                  description:
                    'Visi na šipki, noge skupljene, podižeš ih do visine struka ili više (što teže to bolje), polako spuštaš. Ne njišeš se.',
                  setsReps: '5 serija — do otkaza',
                  imageUrl: '/exercises/hanging-leg-raises.png',
                  order: 6,
                },
              ],
            },
          },
          {
            name: 'Pull',
            weekDay: 1,
            exercises: {
              create: [
                {
                  name: 'Lat pulldown hook grip',
                  description:
                    'Sedi na mašinu za lat pulldown, uzmi šipku širokim hvataom sa kukastim prstima (hook grip - palac ne omotava šipku), povuci prema bradi, lopatice skupi, polako pusti gore.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/lat-pulldown-hook-grip.png',
                  order: 0,
                },
                {
                  name: 'Cable low row',
                  description:
                    'Sedi ispred niskog kabla, uzmi hvatač, leđa ravna, povuci prema stomaku skupljajući lopatice, laktovi idu unazad, polako ispruži ruke.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/cable-low-row.png',
                  order: 1,
                },
                {
                  name: 'Machine row upper back',
                  description:
                    'Sedi na mašinu za veslanje, grudi na jastučiću, uzmi ručke, povuci prema sebi naglašavajući gornji deo leđa i lopatice, polako vrati.',
                  setsReps: '2 serije — 6-8 / 10-12',
                  imageUrl: '/exercises/machine-row-upper-back.png',
                  order: 2,
                },
                {
                  name: 'Scott db bicep curl',
                  description:
                    'Sedi za scott klupu (kosa klupa za biceps), nasloni nadlaktice na jastučić, uzmi bučice, savijaj laktove prema gore, na vrhu stisni biceps, polako spusti.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/scott-db-bicep-curl.png',
                  order: 3,
                },
                {
                  name: 'EZ bar curl',
                  description:
                    'Uzmi EZ šipku, radi curl do otkaza, odmah smanji težinu i nastavi do otkaza, pa opet smanji i do otkaza - sve bez odmora. Tri težine, bez pauze.',
                  setsReps: '1 serija — triple drop set',
                  imageUrl: '/exercises/ez-bar-curl.png',
                  order: 4,
                },
                {
                  name: 'Cable curl with a bar',
                  description:
                    'Uzmi kablovsku šipku za biceps curl, radi npr. 5 ponavljanja, pauza 10-15 sekundi, pa opet 5, pauza, pa opet 5 - sve to je jedan cluster set.',
                  setsReps: '1 serija — cluster set',
                  imageUrl: '/exercises/cable-curl-with-bar.png',
                  order: 5,
                },
                {
                  name: 'Cable rear delt',
                  description:
                    'Stani između dva kabla ili koristi jedan, savij se blago napred, ruke ispružene, povlačiš kabel u stranu nazad naglašavajući zadnji deo ramena.',
                  setsReps: '4 serije — 20 / 15 / 8 / 12',
                  imageUrl: '/exercises/cable-rear-delt.png',
                  order: 6,
                },
                {
                  name: 'Standing calves',
                  description:
                    'Na mašini za tegove stojeći, pete vise u vazduhu, podižeš se na prste što više možeš, kratka pauza gore, polako spuštaš.',
                  setsReps: '5 serija — 15',
                  imageUrl: '/exercises/standing-calves.png',
                  order: 7,
                },
              ],
            },
          },
          {
            name: 'Leg',
            weekDay: 2,
            exercises: {
              create: [
                {
                  name: 'Squat smith',
                  description:
                    'Na Smith mašini, šipka na ramenima, noge u širini ramena, spuštaš se kao na stolicu do paralelno ili dublje, leđa ravna, koljena prate prste, potisni gore.',
                  setsReps: '2 serije — 6-8 / 10-12',
                  imageUrl: '/exercises/squat-smith.png',
                  order: 0,
                },
                {
                  name: 'Leg press',
                  description:
                    'Sedi na mašinu za potisak nogama, noge na platformi u širini ramena, spusti platformu do kuta ~90° u koljenu, potisni gore ali ne zaključavaj koljena.',
                  setsReps: '2 serije — 12',
                  imageUrl: '/exercises/leg-press.png',
                  order: 1,
                },
                {
                  name: 'DB lunges',
                  description:
                    'Uzmi bučice u svake ruke, stoj uspravno, napravi veliki korak napred, spusti stražnje koljeno skoro do poda, vrati se i menjaj noge.',
                  setsReps: '1 serija — 10 po nozi',
                  imageUrl: '/exercises/db-lunges.png',
                  order: 2,
                },
                {
                  name: 'Adductor',
                  description:
                    'Sedi na mašinu za unutrašnji deo bedra (aduktor), noge na jastučićima u razmaknutom položaju, stisni noge zajedno, polako vrati u početni položaj.',
                  setsReps: '3 serije — 20',
                  imageUrl: '/exercises/adductor.png',
                  order: 3,
                },
                {
                  name: 'Hamstring sitting curl',
                  description:
                    'Sedi na mašinu za zadnju ložu, jastučić na tegovima, savijaj noge prema dole/nazad što više možeš, stisni na kraju pokreta, polako pusti.',
                  setsReps: '4 serije — 12 / 10 / 6-8 / 10',
                  imageUrl: '/exercises/hamstring-sitting-curl.png',
                  order: 4,
                },
                {
                  name: 'RDL',
                  description:
                    'Uzmi šipku ili bučice, stoj uspravno, blago savij koljena, spuštaš težinu niz noge držeći leđa ravnim, osetiš istezanje zadnje lože, vratiš se gore stiskajući zadnjicu.',
                  setsReps: '2 serije — 15',
                  imageUrl: '/exercises/rdl.png',
                  order: 5,
                },
              ],
            },
          },
          {
            name: 'Odmor',
            weekDay: 3,
            exercises: { create: [] },
          },
          {
            name: 'Push',
            weekDay: 4,
            exercises: {
              create: [
                {
                  name: 'Barbell incline press',
                  description:
                    'Legni na klupu pod nagibom (~30-45°), uzmi šipku nešto šire od ramena, spusti do gornjeg dela grudi, potisni gore. Fokus na gornji grudni mišić.',
                  setsReps: '3 serije — 6-8 / 8-10 / 12',
                  imageUrl: '/exercises/barbell-incline-press.png',
                  order: 0,
                },
                {
                  name: 'Machine shoulder press',
                  description:
                    'Sedi na mašinu za ramena, uzmi ručke na visini ramena, potisni prema gore do ispružanja, polako vrati. Leđa ravna uz naslon.',
                  setsReps: '2 serije — 6-8 / 10-12',
                  imageUrl: '/exercises/machine-shoulder-press.png',
                  order: 1,
                },
                {
                  name: 'Skull crush',
                  description:
                    'Legni na klupu, uzmi EZ šipku ili šipku, ispruži ruke gore, savijaj samo laktove spuštajući šipku prema čelu (ili iza glave), ispruži nazad. Nadlaktice miruju.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/skull-crush.png',
                  order: 2,
                },
                {
                  name: 'Dips tricep focused',
                  description:
                    'Na paralelnim šipkama, telo uspravno (ne naginjati napred - to je za grudi), laktovi idu unazad, spuštaj telo savijajući laktove, potisni gore. Fokus na triceps.',
                  setsReps: '2 serije — 10',
                  imageUrl: '/exercises/dips-tricep-focused.png',
                  order: 3,
                },
                {
                  name: 'One arm rope tricep',
                  description:
                    'Jednom rukom uzmi uže na kablovu, lakat uz telo, pritisni prema dole do ispružanja, lagano rotiraj šaku prema van na dnu pokreta za bolji stisak tricepa.',
                  setsReps: '2 serije — 12',
                  imageUrl: '/exercises/one-arm-rope-tricep.png',
                  order: 4,
                },
                {
                  name: 'Cable side delt',
                  description:
                    'Stani sa strane kablovske mašine, uzmi kabel suprotnom rukom (npr. levom rukom desni kabel), podižeš ruku u stranu do visine ramena, polako spuštaš.',
                  setsReps: '4 serije — 12',
                  imageUrl: '/exercises/cable-side-delt.png',
                  order: 5,
                },
                {
                  name: 'Crunches (abs)',
                  description:
                    'Legni na pod, noge savijene, ruke iza glave ili na prsima, podižeš gornji deo tela prema koljenima koristeći samo trbušne mišiće, ne vuci za vrat.',
                  setsReps: '4 serije — 20',
                  imageUrl: '/exercises/crunches-abs.png',
                  order: 6,
                },
              ],
            },
          },
          {
            name: 'Pull',
            weekDay: 5,
            exercises: {
              create: [
                {
                  name: 'Bent over row',
                  description:
                    'Uzmi šipku, savij se napred u struku (~45°), leđa ravna, povlačiš šipku prema stomaku/donjem delu grudi, lopatice skupiš, polako spuštaš.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/bent-over-row.png',
                  order: 0,
                },
                {
                  name: 'Low cable one arm lat row',
                  description:
                    'Stani ili klekni ispred niskog kabla, jednom rukom uzmi hvatač, povlačiš prema boku skupljajući lateralni mišić leđa (lat), lakat ide unazad i prema gore.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/low-cable-one-arm-lat-row.png',
                  order: 1,
                },
                {
                  name: 'Wide grip lat pulldown',
                  description:
                    'Uzmi šipku širokim hvataom (šire od ramena), sedi, povuci prema bradi skupljajući lopatice, oseti kontrakciju leđa, polako pusti gore.',
                  setsReps: '3 serije — 10',
                  imageUrl: '/exercises/wide-grip-lat-pulldown.png',
                  order: 2,
                },
                {
                  name: 'Rack pull',
                  description:
                    'Kao mrtvo dizanje ali sa skraćenim pokretom - šipka počinje na visini koljena (na ramu), dižeš samo gornji deo pokreta, na vrhu stisneš zadnjicu i leđa. Lagana težina, naglasak na stisak.',
                  setsReps: '2 serije — 12',
                  imageUrl: '/exercises/rack-pull.png',
                  order: 3,
                },
                {
                  name: 'Bicep Scott machine',
                  description:
                    'Mašinska verzija scott curla, nasloniš nadlaktice na jastučić, savijaj laktove prema gore, stisni biceps na vrhu, polako spusti. Izolirana vežba za biceps.',
                  setsReps: '3 serije — 12',
                  imageUrl: '/exercises/bicep-scott-machine.png',
                  order: 4,
                },
                {
                  name: 'Biceps concentration curl',
                  description:
                    'Sedi na klupu, savij se blago napred, lakat nasloni na unutrašnju stranu bedra, savijaj jednu ruku prema ramenu, stisni biceps na vrhu, polako spusti.',
                  setsReps: '2 serije — 12',
                  imageUrl: '/exercises/biceps-concentration-curl.png',
                  order: 5,
                },
                {
                  name: 'Rear delt fly with DB',
                  description:
                    'Sedi na kraj klupe, savij se jako napred (grudi na koljenima), uzmi bučice, podižeš ruke u stranu u luku naglašavajući zadnji deo ramena, polako spuštaš.',
                  setsReps: '3 serije — 12',
                  imageUrl: '/exercises/rear-delt-fly-db.png',
                  order: 6,
                },
                {
                  name: 'Sitting calves',
                  description:
                    'Na mašini za tegove sedeći, jastučići na koljenima, podižeš pete što više, kratka pauza, polako spuštaš. Sedeća verzija više naglašava soleus mišić.',
                  setsReps: '5 serija — 15',
                  imageUrl: '/exercises/sitting-calves.png',
                  order: 7,
                },
              ],
            },
          },
          {
            name: 'Odmor',
            weekDay: 6,
            exercises: { create: [] },
          },
        ],
      },
    },
  })

  console.log('Seed završen: Raspored treninga')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
