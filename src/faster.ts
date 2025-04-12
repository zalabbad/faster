type FasterVideo = {
  video: HTMLVideoElement;
  playbackRate: number;
};

let pageVideos: FasterVideo[] = [];

const findVideos = (root: HTMLElement | ShadowRoot) => {
  const videos: HTMLVideoElement[] = [];
  if ([1, 9, 11].includes(root.nodeType)) {
    root.querySelectorAll('*').forEach(element => {
      if (element.shadowRoot) {
        videos.push(...findVideos(element.shadowRoot));
      } else if (element.tagName === 'VIDEO') {
        videos.push(element as HTMLVideoElement);
      }
    });
  }
  return videos;
};

findVideos(document.body).forEach(video => trackVideo(video));


function trackVideo(video: HTMLVideoElement) {

  if (pageVideos.some(v => v.video === video)) {
    return;
  }

  const playbackRateSelector = document.createElement('select');
  // Playback Rate Selector Style
  playbackRateSelector.style.position = 'absolute';
  playbackRateSelector.style.top = '10px';
  playbackRateSelector.style.left = '10px';
  playbackRateSelector.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  playbackRateSelector.style.color = 'white';
  playbackRateSelector.style.padding = '15px';
  playbackRateSelector.style.borderRadius = '15px';
  playbackRateSelector.style.zIndex = '9999';
  playbackRateSelector.style.cursor = 'pointer';
  playbackRateSelector.style.opacity = '0.3';
  playbackRateSelector.onmouseover = () => {
    playbackRateSelector.style.opacity = '1';
  };
  playbackRateSelector.onmouseout = () => {
    playbackRateSelector.style.opacity = '0.3';
  };

  // Playback Rate Options
  const playbackRates = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];
  playbackRates.forEach(rate => {
    const option = document.createElement('option');
    option.value = rate.toString();
    option.textContent = `${rate}x`;
    playbackRateSelector.appendChild(option);
  });

  playbackRateSelector.onchange = () => {
    const rate = Number(playbackRateSelector.value);
    video.playbackRate = rate;
  };

  // @ts-ignore
  video.parentElement.style.position = 'relative';
  // @ts-ignore
  video.parentElement.appendChild(playbackRateSelector);


  pageVideos.push({
    video,
    playbackRate: 1
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        findVideos(node as HTMLElement).forEach(video => trackVideo(video));
      })
    }
  })
})

observer.observe(document.body, {
childList: true,
  subtree: true,
  attributes: false,
  attributeOldValue: false,
  characterData: false
});
