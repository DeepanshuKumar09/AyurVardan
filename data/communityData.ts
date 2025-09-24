import type { CommunityPost } from '../types';

export const communityPostsData: CommunityPost[] = [
  {
    id: 1,
    author: 'Riya Patel',
    authorImageUrl: 'https://picsum.photos/seed/comm1/100/100',
    content: 'Just started my Panchakarma journey! A bit nervous but also very excited. Any tips for a first-timer on how to get the most out of the experience?',
    timestamp: '2 hours ago',
    comments: [
      {
        id: 101,
        author: 'Dr. Anjali Sharma',
        authorImageUrl: 'https://picsum.photos/seed/doc1/100/100',
        content: 'Wonderful, Riya! The key is to relax, trust the process, and allow your body to rest. Stay hydrated with warm water and enjoy the nourishing meals. We are here for you!',
        timestamp: '1 hour ago',
      },
      {
        id: 102,
        author: 'Amit Kumar',
        authorImageUrl: 'https://picsum.photos/seed/comm2/100/100',
        content: 'I did it last year! My advice: disconnect from your phone as much as possible. It really helps you tune into your body. Good luck!',
        timestamp: '30 minutes ago',
      },
    ],
  },
  {
    id: 2,
    author: 'Kavita Singh',
    authorImageUrl: 'https://picsum.photos/seed/comm3/100/100',
    content: 'Does anyone have a good, simple recipe for Kitchari that is good for balancing Pitta? My digestion has been feeling a bit fiery lately.',
    timestamp: '8 hours ago',
    comments: [
       {
        id: 201,
        author: 'Sunita Devi',
        authorImageUrl: 'https://picsum.photos/seed/comm4/100/100',
        content: 'I love using split mung beans and basmati rice. For Pitta, use cooling spices like coriander and fennel, and add a little cilantro at the end. I also use coconut oil or ghee instead of other oils.',
        timestamp: '7 hours ago',
      },
    ],
  },
  {
    id: 3,
    author: 'Prakash Verma',
    authorImageUrl: 'https://picsum.photos/seed/pat2/100/100',
    content: 'I am so grateful for this app. After years of digestive issues, the advice from my doctor here and the diet changes have made a world of difference. Feeling better than I have in a long time!',
    timestamp: '1 day ago',
    comments: [],
  },
];
