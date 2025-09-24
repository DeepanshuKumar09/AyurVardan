import type { YogaAsana } from '../types';

export const yogaAsanas: YogaAsana[] = [
  {
    id: 1,
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    description: 'A grounding pose that improves posture and firms muscles. Excellent for calming the mind.',
    steps: [
        'Stand with feet together, big toes touching.',
        'Distribute weight evenly across both feet.',
        'Engage thigh muscles, lift kneecaps.',
        'Keep shoulders relaxed, arms alongside body, palms facing forward.',
        'Breathe deeply and hold the pose.'
    ],
    benefits: 'Grounds Vata energy, builds stability for Kapha. Improves focus and posture.',
    timeOfDay: 'Morning, to set a stable foundation for the day.',
    repetitions: 'Hold for 30-60 seconds, 3-5 times.',
    doshas: ['Vata', 'Kapha'],
  },
  {
    id: 2,
    name: 'Tree Pose',
    sanskritName: 'Vrikshasana',
    description: 'Improves balance and stability. Strengthens legs and opens hips. Calms a scattered mind.',
    steps: [
        'Start in Mountain Pose.',
        'Shift weight to your left foot.',
        'Place the sole of your right foot on your inner left thigh or calf (avoid the knee).',
        'Bring hands to prayer position at your chest.',
        'Gaze at a fixed point to maintain balance.'
    ],
    benefits: 'Excellent for calming an anxious Vata mind by improving focus and balance.',
    timeOfDay: 'Anytime, especially when feeling scattered or anxious.',
    repetitions: 'Hold for 30 seconds per side, 2-3 times.',
    doshas: ['Vata'],
  },
  {
    id: 3,
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    description: 'A gentle backbend that increases spinal flexibility and relieves stress. Stimulates digestion.',
    steps: [
        'Lie on your stomach, forehead on the floor.',
        'Place hands under your shoulders, palms flat.',
        'Inhale and lift your head, chest, and upper abdomen, keeping your navel on the floor.',
        'Keep shoulders relaxed and away from ears.',
        'Exhale to release back down.'
    ],
    benefits: 'Opens the chest, which can help pacify Kapha. Stimulates digestive fire (Agni), beneficial for Pitta.',
    timeOfDay: 'Morning or afternoon to energize the body.',
    repetitions: 'Hold for 15-30 seconds, repeat 3-5 times.',
    doshas: ['Pitta', 'Kapha'],
  },
  {
    id: 4,
    name: 'Fish Pose',
    sanskritName: 'Matsyasana',
    description: 'Opens the chest and throat, improving breathing. Energizes the body and relieves tension.',
    steps: [
        'Lie on your back, legs straight.',
        'Place hands, palms down, under your hips for support.',
        'Press into your elbows and forearms to lift your chest, creating an arch in your back.',
        'Gently release the crown of your head to the floor.',
        'Keep weight on your elbows, not your head.'
    ],
    benefits: 'A powerful chest-opener that counteracts Pitta-related tension in the shoulders and neck.',
    timeOfDay: 'Afternoon, to relieve midday stress.',
    repetitions: 'Hold for 20-40 seconds, 2-3 times.',
    doshas: ['Pitta'],
  },
  {
    id: 5,
    name: 'Wind-Relieving Pose',
    sanskritName: 'Pawanmuktasana',
    description: 'Excellent for massaging the digestive organs and relieving gas, bloating, and constipation.',
    steps: [
        'Lie on your back.',
        'Exhale and draw both knees to your chest.',
        'Clasp your hands around your shins or thighs.',
        'Keep your lower back flat on the floor.',
        'Optionally, lift your head toward your knees on an exhale.'
    ],
    benefits: 'Directly targets Vata imbalances in the colon, relieving gas and bloating.',
    timeOfDay: 'Morning, before getting out of bed, or evening to aid digestion.',
    repetitions: 'Hold for 30-60 seconds, repeat 3 times.',
    doshas: ['Vata'],
  },
  {
    id: 6,
    name: 'Corpse Pose',
    sanskritName: 'Savasana',
    description: 'Promotes deep relaxation, calms the nervous system, and helps reduce stress and fatigue.',
    steps: [
        'Lie comfortably on your back.',
        'Let your feet fall open naturally.',
        'Place arms alongside your body, palms facing up, slightly away from your body.',
        'Close your eyes and allow your body to feel heavy.',
        'Focus on your breath, releasing tension with each exhale.'
    ],
    benefits: 'The ultimate pose for pacifying all three doshas. It calms Vata, cools Pitta, and lightens Kapha.',
    timeOfDay: 'At the end of any yoga practice, or anytime you need deep rest.',
    repetitions: 'Rest for 5-15 minutes.',
    doshas: ['Vata', 'Pitta', 'Kapha'],
  },
  {
    id: 7,
    name: 'Warrior II Pose',
    sanskritName: 'Virabhadrasana II',
    description: 'Builds stamina and concentration. Strengthens the legs and opens the hips and shoulders.',
    steps: [
        'Stand with feet wide apart (about 3-4 feet).',
        'Turn your right foot out 90 degrees and your left foot in slightly.',
        'Bend your right knee over your right ankle.',
        'Extend arms parallel to the floor, gazing over your right hand.',
        'Keep your torso centered and shoulders relaxed.'
    ],
    benefits: 'Builds heat and strength, which is good for energizing Kapha. The focused gaze can help stabilize a fiery Pitta mind.',
    timeOfDay: 'As part of a morning or daytime dynamic practice.',
    repetitions: 'Hold for 30-60 seconds on each side, repeat twice.',
    doshas: ['Pitta', 'Kapha'],
  },
];