export const RECIPES = [
  {
    id: '1',
    title: '西红柿炒鸡蛋',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb5cHMSp9KUNHu7VacGDQeB5aBNeTD-tXi28X6CiddKNHCBiauI1JtxxSsdPWE8rbPsnylt_PncfdlOiJtri6iFn6hK0ZO34bUf7Jft4rAh-upyYFYT6O6zXNRCBCNuOxUHqqPH96ESN_eaQ7OjMt1GyKtSwS_SvJkbGGz-x8UD-JJ5lMHUP4C9XbwNEgnIAocZnH6lv6kcitG8cvM-WKCnTcZK1IZNl0XvmcFNAPajjgLAT1X4A3_sk1bZeHFzox8-eH03saenY8',
    tags: ['西红柿', '鸡蛋'],
    category: 'Dinner',
    prepTime: '5 分钟',
    cookTime: '10 分钟',
    totalTime: '15 分钟',
    ingredients: [
      { name: '西红柿', amount: '2个' },
      { name: '鸡蛋', amount: '3个' },
      { name: '葱', amount: '适量' },
      { name: '盐', amount: '少许' }
    ],
    steps: [
      { id: 1, instruction: '西红柿切块，鸡蛋打散备用。' },
      { id: 2, instruction: '锅中热油，倒入鸡蛋液炒熟盛出。' },
      { id: 3, instruction: '锅底留油，放入葱花爆香，加入西红柿翻炒出汁。' },
      { id: 4, instruction: '倒入炒好的鸡蛋，加盐调味即可。' }
    ]
  },
  {
    id: '2',
    title: '清炒西兰花',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLXZ9sc4hFZQv-xm_FOCikgBmhRac4f8MChL5BuUx04BNwpBFuCeDQhsfCP64TsoDgs6g37s6_hCu1KrYi1tL5JFNmGh6GwaiZxihVih36Tq6JBNpUWZ1FcZ0M28KyW0r_xloBBC1rJNKMto0fpGgT8OJmeYwNVqjqzy-xCtiPfepE1twsU2GFwHiTbY2fpVX2-BuW1H923Yd3lpVtHpm-8vd5RgIjWbUetuz6TbeUm7nZC2UM5O0V5e9P7WS3po2Jx3hI0j7DFK0',
    tags: ['西兰花', '大蒜'],
    category: 'Dinner',
    prepTime: '5 分钟',
    cookTime: '5 分钟',
    totalTime: '10 分钟',
    ingredients: [
      { name: '西兰花', amount: '1颗' },
      { name: '大蒜', amount: '3瓣' }
    ],
    steps: [
      { id: 1, instruction: '西兰花切小朵，洗净焯水备用。' },
      { id: 2, instruction: '热锅凉油，放入蒜末爆香。' },
      { id: 3, instruction: '加入西兰花快速翻炒，加盐调味。' }
    ]
  },
  {
    id: '3',
    title: '紫菜蛋花汤',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXABSUoaFPcTM29m2ML7gZ3CLSmUezrMyr3tbmzLCLeQPVXLxieA-MB-VE-yYuziWrDKbgGpr9v6ynpyoKgsKG5qOBFqRK5OqMvkG3Gdg-7v8mr4IpUvp-wjmgIlK510__fP1hHVleVGirBrEIR8QYzrPB0_Cs1MjauQ0vPpHokFVy9Yyswhrh_QE_Bs8lDTFfIiHQI1O67vYi90GBAHoEH0wZUW9pJl_thY5q8E0jJgFavSvuqstrNOvNaC0zNdC_MX_Rd-QDZw',
    tags: ['鸡蛋', '紫菜'],
    category: 'Dinner',
    prepTime: '2 分钟',
    cookTime: '5 分钟',
    totalTime: '7 分钟',
    ingredients: [
      { name: '鸡蛋', amount: '1个' },
      { name: '紫菜', amount: '少许', available: false }
    ],
    steps: [
      { id: 1, instruction: '水烧开，放入紫菜。' },
      { id: 2, instruction: '淋入蛋液，加盐和香油出锅。' }
    ]
  },
  {
    id: '4',
    title: '牛奶燕麦粥',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuaTyVZSzEQ10z1Zrb8QwS1IrKXzhSHRtChOoOSMOx-AFyfANKmP4TKimfsikay3OnWUn20yI_Tvh0VtLU7BJJHyVOC-aFlKlEum4FEwZ9kEXKkqcfTAs8jjDc7TWnVWd1X2AuiqOhoPmesyDZBirhqayR9L0beSUGN_nCC_dhmODCHfdq5-L-a3zWXQyEFEOaNDZ_ytTZ1BKNT8G1bqhnUJr3LXIAEhQL6OZZp0PgkvRSYCCm11jWpOsKAUhEZSBpBw79whlk0jU',
    tags: ['牛奶', '燕麦'],
    category: 'Breakfast',
    prepTime: '1 分钟',
    cookTime: '5 分钟',
    totalTime: '6 分钟',
    ingredients: [
      { name: '牛奶', amount: '250ml' },
      { name: '燕麦', amount: '50g' }
    ],
    steps: [
      { id: 1, instruction: '牛奶倒入锅中煮热。' },
      { id: 2, instruction: '加入燕麦片搅拌均匀，小火煮至浓稠。' }
    ]
  },
  {
    id: '5',
    title: '意大利面',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmdQxkbFzh4SGmInVOC7lcyx3uhgz44tNDLU4xAgBoIKIZRZ23bjbT-8BXSBADKc1hzDS81HaAYYRkkYAdYUYgjh8nhiQg7C5lgIEz47x8inf0j-EbJ2EE11Qv1HvBn7MC9mKldBE1pY70Cr-3OHexVsVFLxPjSGiGbofv1bQS_oIIWmxQptqkrUNov1NdtvB79WXf1sBc99AIiZo9sjP6-aYl3FDZttpYFRcqz-EXspBkcZpFhzGICba8ac_r04g2WkzkmScPBAE',
    tags: ['意大利面', '西红柿'],
    category: 'Lunch',
    prepTime: '10 分钟',
    cookTime: '20 分钟',
    totalTime: '30 分钟',
    ingredients: [
      { name: '意大利面', amount: '200克' },
      { name: '西红柿', amount: '400克' },
      { name: '大蒜', amount: '2 瓣' },
      { name: '花椒', amount: '1 根', available: false }
    ],
    steps: [
      { id: 1, instruction: '将意大利面按照包装上的指示煮熟。' },
      { id: 2, instruction: '在煮面的同时，在平底锅中加热少许油，加入切碎的大蒜和花椒煸炒至出香。' },
      { id: 3, instruction: '加入西红柿煮出汁，然后加入煮熟的意大利面搅拌均匀。' }
    ]
  },
  {
    id: '6',
    title: '可乐鸡翅',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAogHMQr5pRt-iJBeulWAmZqfxD5kRb-kzkc2SCJIxneX59nWIw9hKeiKb6jOKVw9Dz4sQfvZYlKN7vmnoFR0xhWC7SCFHxENwW5bQe3Pgb3Nu2yG37mzSc3rgx4OasIfOY4fzyrOhudxIpwFwpQhgSjOHhko1HXpTqCx6UdaFOHGZzyV-JU6VnlD-U_fmWEtsJyEhK4NbHx7AT5ChfFU6TxrdQCns50P4nKEEaJq4kHefuJ5g3CJ67D1vUGN5C9lWT2ze7ZX-0dQ',
    tags: ['鸡翅', '可乐'],
    category: 'Dinner',
    prepTime: '10 分钟',
    cookTime: '20 分钟',
    totalTime: '30 分钟',
    ingredients: [
      { name: '鸡翅', amount: '500g' },
      { name: '可乐', amount: '1罐' }
    ],
    steps: [
      { id: 1, instruction: '鸡翅两面划刀，焯水去腥。' },
      { id: 2, instruction: '锅中煎鸡翅至两面金黄。' },
      { id: 3, instruction: '倒入可乐，小火焖煮至收汁。' }
    ]
  }
];

export const FRIDGE_ITEMS = [
  { id: '1', name: '西红柿', quantity: '约 3 个', category: '蔬菜', image: 'https://img.gs/fhcwfyfhtl/112x112,quality=80/https://lh3.googleusercontent.com/aida-public/AB6AXuAnD3cboXevZvlRlqXrlacHANjj4a29DZVEQeo1qeMPFf_PPULqdtiaWPYvyMpD1gRULdg_MYqWp7KtyPDJqUqxpDaa-GAUtMFRQIx4rxhubNTDA4NEtNVyfJofFDKzMnrm193_2eXt2_cg9kFZJB2wrvOMcr4C6UReANkdBNRpoHtla3fagwJvi3EDPyCmAut5BsFUQlAB2ocLC6Z_JC66QEHuAv9Z880ofFZldD83Ju9InMa72neuzIkqVkuCZBjafHp2y4Mv-tg' },
  { id: '2', name: '生菜', quantity: '约 1 颗', category: '蔬菜', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn9h6mgCyVYP6EoDyKzOrSU0MDAMG6IAfa9jE8I_kkg5b0uDoJi9pCj02rB3sqcemrMr05cIPQv32UJJZGMIku0O04a2exPrTQITCMK7nkwDBqqs46Ru4sBAsqu2xXTI3GGLHdjK--NaNpyAPdjOGBNAQehaA8UZ5Oxo02S0v6gzyS0vNBaBVVwoqJverabx15gxQrn_OZ6uPok5SyGx6yLDBYeVdmJ_K7L6PTaAEI5fSyvRrGksQlzanxFMgF7uRFPTFrcVZNLfY' },
  { id: '3', name: '苹果', quantity: '约 3 个', category: '水果', image: 'https://img.gs/fhcwfyfhtl/112x112,quality=80/https://lh3.googleusercontent.com/aida-public/AB6AXuAdQyTptFvWZgOaE-vcOPclLuVro_pl5A2Ff432ivDehsWT_LtlodBHMAJEx83NO9i0hRku_bCoYKGrLiOtvHkJANWjRpw3giwI0AJpzP_n_MMB-r2LoDH4Puh0BmogRURVM_dxcztsm7d0ftb57ldSlXQq6duAXV7wkNiJwlZ9i_AqFFYz1G8-68PKEsIpka1cTxqr_FNkez50WUS32F5ziMwEQ8TAXCC1UrMzLixskFm1WhHW3EuQkqM4Y6xmin6uTrBt11NxL8I' },
  { id: '4', name: '香蕉', quantity: '约 2 根', category: '水果', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn9h6mgCyVYP6EoDyKzOrSU0MDAMG6IAfa9jE8I_kkg5b0uDoJi9pCj02rB3sqcemrMr05cIPQv32UJJZGMIku0O04a2exPrTQITCMK7nkwDBqqs46Ru4sBAsqu2xXTI3GGLHdjK--NaNpyAPdjOGBNAQehaA8UZ5Oxo02S0v6gzyS0vNBaBVVwoqJverabx15gxQrn_OZ6uPok5SyGx6yLDBYeVdmJ_K7L6PTaAEI5fSyvRrGksQlzanxFMgF7uRFPTFrcVZNLfY' },
  { id: '5', name: '鸡胸肉', quantity: '约 1 块', category: '肉类', image: 'https://img.gs/fhcwfyfhtl/112x112,quality=80/https://lh3.googleusercontent.com/aida-public/AB6AXuA1MrHRtr8V1s4ji6EjhfTnuMqDMQzcB7uosj7TgD46gvpjyc8FamWLaD3VIWvopNK1d98l1jFAimKnZwddHRWta0IlcFo_r-QWSmkK7GKWfaIYtXDCipzDEVrthnXsI_DyEAEtOU5GWfRvaI88ygC6NsHogPIra-6nN_rUmOF6OBtGYX06ehcBjTwtyr7EQCvSfxh7GCsGrepBCmDfwjPn1H5BmblGY1l-OBXLK2O9hOn7Gc2p2JWSOBEyO-kIf4iuKm0w9CrT2lI' },
];

export const SHOPPING_ITEMS = [
  { id: '1', name: '豆腐', checked: false, category: '豆制品' },
  { id: '2', name: '豆浆', checked: false, category: '豆制品' },
  { id: '3', name: '西红柿', checked: false, category: '蔬菜' },
  { id: '4', name: '黄瓜', checked: false, category: '蔬菜' },
  { id: '5', name: '葱', checked: false, category: '蔬菜' },
  { id: '6', name: '蒜', checked: false, category: '蔬菜' },
];
