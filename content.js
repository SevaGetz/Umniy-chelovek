const replacementThumbnail = chrome.runtime.getURL("src/thumbnail.jpg");
const replacementAvatar = chrome.runtime.getURL("src/avatar.jpg");

let previousState = null;

function replaceImagesIfEnabled() {
  chrome.storage.sync.get('enabled', (data) => {
    const enabled = data.enabled ?? true;

    if (previousState === null) {
      previousState = enabled;
    } else if (previousState !== enabled) {
      location.reload();
    }

    if (!enabled) return;

    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const src = img.src || '';
      const alt = img.alt?.toLowerCase() || '';

      const isThumbnail =
        src.includes('vi.') ||
        src.includes('ytimg.com') ||
        alt.includes('thumbnail') ||
        img.closest('ytd-thumbnail');

      const isAvatar =
        src.includes('yt3.ggpht.com') ||
        img.closest('ytd-channel-renderer') ||
        img.closest('ytd-video-renderer')?.querySelector('a#avatar-link');

      if (isThumbnail) {
        img.src = replacementThumbnail;
        img.removeAttribute('srcset');
      }

      if (isAvatar) {
        img.src = replacementAvatar;
        img.removeAttribute('srcset');
      }
    });
  });
}

replaceImagesIfEnabled();

const observer = new MutationObserver(replaceImagesIfEnabled);
observer.observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && "enabled" in changes) {
    replaceImagesIfEnabled();
  }
});

document.querySelectorAll('ytd-channel-name, a.yt-simple-endpoint.style-scope.yt-formatted-string').forEach(channel => {
  if (channel.textContent) {
    channel.textContent = 'Умный человек';
  }
});
