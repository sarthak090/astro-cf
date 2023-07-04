export function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

export function getYtEmbed(embedId, title) {
  const embedHtml = `
    <div style="width: 100%; max-width: 600px;  margin: 0 auto;">
    <div style="position: relative; padding-bottom: 56.15%; height: 0; overflow: hidden;">
      <iframe 
        style="position: absolute; top: 0; left:0; width: 100%; height: 100%; border: 0;"
        loading="lazy";
        srcdoc="<style>
          * {
          padding: 0;
          margin: 0;
          overflow: hidden;
          }
          
          body, html {
            height: 100%;
          }
          
          img, svg {
            position: absolute;
            width: 100%;
            top: 0;
            bottom: 0;
            margin: auto;
          }
          
          svg {
            filter: drop-shadow(1px 1px 10px hsl(206.5, 70.7%, 8%));
            transition: all 250ms ease-in-out;
          }
          
          body:hover svg {
            filter: drop-shadow(1px 1px 10px hsl(206.5, 0%, 10%));
            transform: scale(1.2);
          }
        </style>
        <a href='https://www.youtube.com/embed/${embedId}?autoplay=1'>
          <img src='https://img.youtube.com/vi/${embedId}/hqdefault.jpg' alt='${title}'>
          <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>
        </a>
        "
        src="https://www.youtube.com/embed/${embedId}" 
     
        frameborder="0"
        title="${title}"
  
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  </div>  `;
  return embedHtml;
}
