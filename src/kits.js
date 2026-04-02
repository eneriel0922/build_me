const BASE = import.meta.env.BASE_URL

export const KITS = {
  v1: {
    id: 'v1',
    title: 'ENER - 1, BUILD ME',
    model: `${BASE}models/build_me.glb`,
    background: 'dawn',
    image: `${BASE}images/v1_image.png`,
  },
  v2: {
    id: 'v2',
    title: 'ENER 2, UPGRADE',
    model: `${BASE}models/build_me2.glb`,
    background: 'blue_grass',
    image: `${BASE}images/v2_image.png`,
  },
  v3: {
    id: 'v3',
    title: 'ENER Z, eRr00orrrrorrz@#%7',
    model: `${BASE}models/build_me3.glb`,
    background: 'glitch_blood',
    image: `${BASE}images/v3_image.png`,
  }
}