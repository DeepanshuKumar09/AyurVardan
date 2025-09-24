import type { Herb } from '../types';

export const herbsData: Herb[] = [
  {
    id: 1,
    name: 'Tulsi',
    botanicalName: 'Ocimum tenuiflorum',
    imageUrl: 'https://picsum.photos/seed/tulsi/400/600',
    description: 'Known as "Holy Basil," Tulsi is a sacred plant in Ayurveda revered for its adaptogenic and purifying properties. It helps the body adapt to stress and supports respiratory health.',
    benefits: ['Reduces Stress & Anxiety', 'Boosts Immunity', 'Supports Respiratory Health', 'Improves Digestion'],
    recipe: {
      title: 'Simple Tulsi Tea',
      ingredients: [
        '10-15 fresh Tulsi leaves',
        '2 cups of water',
        '1 tsp honey (optional)',
        '1/2 tsp grated ginger (optional)',
      ],
      instructions: [
        'Bring water to a boil in a small pot.',
        'Add the Tulsi leaves and grated ginger.',
        'Let it simmer for 5-7 minutes.',
        'Strain the tea into a cup.',
        'Add honey to taste and enjoy warm.',
      ],
    },
  },
  {
    id: 2,
    name: 'Neem',
    botanicalName: 'Azadirachta indica',
    imageUrl: 'https://picsum.photos/seed/neem/400/600',
    description: 'Neem is a powerful blood purifier and detoxifier with potent antibacterial and antifungal properties. It is widely used for skin health and dental care.',
    benefits: ['Purifies Blood', 'Promotes Healthy Skin', 'Supports Dental Health', 'Boosts Liver Function'],
    recipe: {
      title: 'Neem & Turmeric Skin Paste',
      ingredients: [
        '1 tsp Neem powder',
        '1/2 tsp Turmeric powder',
        'Rose water or plain water to make a paste',
      ],
      instructions: [
        'In a small bowl, mix the Neem and Turmeric powder.',
        'Slowly add a few drops of water at a time, mixing until you form a smooth paste.',
        'Apply to clean skin on affected areas.',
        'Let it dry for 10-15 minutes, then rinse off with cool water.',
        'Use 1-2 times a week. (Note: For external use only).'
      ],
    },
  },
  {
    id: 3,
    name: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    imageUrl: 'https://picsum.photos/seed/ashwa/400/600',
    description: 'A renowned "Rasayana" (rejuvenative), Ashwagandha helps in building strength and vitality. It is an excellent adaptogen that calms the nervous system and supports restful sleep.',
    benefits: ['Enhances Strength & Stamina', 'Combats Effects of Stress', 'Improves Sleep Quality', 'Supports Cognitive Function'],
    recipe: {
      title: 'Ashwagandha Moon Milk',
      ingredients: [
        '1 cup of milk (dairy or non-dairy)',
        '1 tsp Ashwagandha powder',
        'A pinch of cinnamon and nutmeg',
        '1 tsp maple syrup or honey',
      ],
      instructions: [
        'Gently warm the milk in a saucepan over low heat.',
        'Whisk in the Ashwagandha powder, cinnamon, and nutmeg until smooth.',
        'Continue to heat for 2-3 minutes, but do not boil.',
        'Pour into a mug, stir in your sweetener.',
        'Drink an hour before bedtime for a restful sleep.',
      ],
    },
  },
   {
    id: 4,
    name: 'Brahmi',
    botanicalName: 'Bacopa monnieri',
    imageUrl: 'https://picsum.photos/seed/brahmi/400/600',
    description: 'Brahmi is a celebrated brain tonic in Ayurveda. It enhances memory, concentration, and cognitive functions while calming the nervous system.',
    benefits: ['Boosts Memory & Intellect', 'Calms the Nerves', 'Supports Healthy Hair', 'Reduces Anxiety'],
    recipe: {
      title: 'Brahmi-Infused Ghee',
      ingredients: [
        '1/2 cup high-quality Ghee',
        '1 tbsp Brahmi powder',
      ],
      instructions: [
        'Gently melt the Ghee in a small, heavy-bottomed pan on low heat.',
        'Once melted, stir in the Brahmi powder.',
        'Keep the heat very low and let it infuse for 5-10 minutes, stirring occasionally. Do not let it brown.',
        'Strain through a fine-mesh sieve or cheesecloth into a clean glass jar.',
        'Use 1 tsp daily in warm milk or on food.'
      ],
    },
  },
];
