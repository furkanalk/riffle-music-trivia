// Show video only if it can autoplay, otherwise show image
function handleMenuCardVideos() {
    const cards = document.querySelectorAll('.main-menu-cards > div .relative');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const img = entry.target.querySelector('img');
        if (!video || !img) return;
        if (entry.isIntersecting) {
        video.currentTime = 0;
        video.classList.remove('hidden');
        img.classList.add('hidden');
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
            // If autoplay fails, show image, hide video, allow user to click video to play
            video.classList.add('hidden');
            img.classList.remove('hidden');
            video.setAttribute('controls', '');
            video.addEventListener('click', function userPlay() {
                video.play();
                video.classList.remove('hidden');
                img.classList.add('hidden');
                video.removeEventListener('click', userPlay);
                video.removeAttribute('controls');
            });
            });
        }
        } else {
        video.pause();
        video.currentTime = 0;
        video.classList.add('hidden');
        img.classList.remove('hidden');
        }
    });
    }, { threshold: 0.5 });
    cards.forEach(card => observer.observe(card));
}
window.addEventListener('DOMContentLoaded', handleMenuCardVideos);