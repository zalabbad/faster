const findAllVideos = (root: Document | ShadowRoot) => {
  const videos: HTMLVideoElement[] = [];
  root.querySelectorAll('video').forEach(video => videos.push(video));
  root.querySelectorAll('*').forEach(node => {
    if (node.shadowRoot) {
      videos.push(...findAllVideos(node.shadowRoot));
    }
  });
  return videos;
};

findAllVideos(document).forEach(video => {
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
  const playbackRates = [1, 1.25, 1.5, 1.75, 2];
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
});
