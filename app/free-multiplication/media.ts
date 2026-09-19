// Original group recordings and complete music video from the ChantCode app.
export type ChantAudio = {
  group: 6 | 7;
  src: string;
  transcript: string;
};

export const chantAudio: ChantAudio[] = [
  {
    group: 6,
    src: "/media/free-multiplication/6s-chants.wav",
    transcript: "Six six thirty-six. Six seven forty-two. Six eight forty-eight. Six nine fifty-four.",
  },
  {
    group: 7,
    src: "/media/free-multiplication/7s-chants.wav",
    transcript: "Seven seven forty-nine. Seven eight fifty-six. Seven nine sixty-three.",
  },
];

export const chantVideo = {
  src: "/media/free-multiplication/multiplication-music-2-to-9.mp4",
  poster: "/media/free-multiplication/multiplication-music-poster.jpg",
};
