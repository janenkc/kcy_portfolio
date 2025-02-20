let iteration = 0;
gsap.set('.cards li', { xPercent: 400, opacity: 0, scale: 0 });

const spacing = 0.1,
  snapTime = gsap.utils.snap(spacing),
  cards = gsap.utils.toArray('.cards li'),
  animateFunc = (element) => {
    const tl = gsap.timeline();
    tl.fromTo(element, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.in', immediateRender: false })
      .fromTo(element, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: 'none', immediateRender: false }, 0);
    return tl;
  },
  seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
  playhead = { offset: 0 },
  wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

document.querySelector('.next').addEventListener('click', () => {
  const nextOffset = playhead.offset + spacing;
  smoothTransitionToOffset(nextOffset);
});

document.querySelector('.prev').addEventListener('click', () => {
  const prevOffset = playhead.offset - spacing;
  smoothTransitionToOffset(prevOffset);
});

function smoothTransitionToOffset(targetOffset) {
  const currentOffset = playhead.offset;
  const duration = Math.abs(targetOffset - currentOffset) * 0.8; // Adjust easing duration
  gsap.to(playhead, {
    offset: targetOffset,
    duration,
    ease: 'power3.inOut', // Use a smoother easing function
    onUpdate() {
      seamlessLoop.time(wrapTime(playhead.offset));
    },
    onComplete() {
      if (playhead.offset >= seamlessLoop.duration()) {
        playhead.offset = 0;
        seamlessLoop.time(0);
      } else if (playhead.offset < 0) {
        playhead.offset = seamlessLoop.duration();
        seamlessLoop.time(playhead.offset);
      }
    },
  });
}

function buildSeamlessLoop(items, spacing, animateFunc) {
  let rawSequence = gsap.timeline({ paused: true }),
    seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 100);
      },
    }),
    cycleDuration = spacing * items.length,
    dur;

  items.concat(items).concat(items).forEach((item, i) => {
    let anim = animateFunc(items[i % items.length]);
    rawSequence.add(anim, i * spacing);
    dur || (dur = anim.duration());
  });

  seamlessLoop.fromTo(
    rawSequence,
    {
      time: cycleDuration + dur / 2,
    },
    {
      time: '+=' + cycleDuration,
      duration: cycleDuration,
      ease: 'none',
    }
  );
  return seamlessLoop;
}
