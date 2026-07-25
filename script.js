// 모바일 메뉴 토글
function toggleMenu(){var m=document.getElementById('menu');if(m)m.classList.toggle('open');}
function closeMenu(){var m=document.getElementById('menu');if(m)m.classList.remove('open');}

document.addEventListener('DOMContentLoaded',function(){

  // 메뉴 링크 클릭 또는 바깥 영역 클릭 시 모바일 메뉴 닫기
  var menu=document.getElementById('menu');
  if(menu){
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
    document.addEventListener('click',function(e){
      if(!e.target.closest('nav')) closeMenu();
    });
    window.addEventListener('resize',function(){ if(window.innerWidth>820) closeMenu(); });
  }

  // 맨 위로 버튼 (모든 페이지에 자동 추가)
  var btn=document.createElement('button');
  btn.id='toTop';
  btn.setAttribute('aria-label','맨 위로');
  btn.innerHTML='↑';
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  document.body.appendChild(btn);
  window.addEventListener('scroll',function(){
    if(window.scrollY>400) btn.classList.add('show'); else btn.classList.remove('show');
  });

  // 연도별 앨범 필터 (album.html 에서만 동작)
  var tabs=document.querySelectorAll('#yearTabs button');
  var grid=document.getElementById('albumGrid');
  if(tabs.length&&grid){
    tabs.forEach(function(tab){
      tab.addEventListener('click',function(){
        tabs.forEach(function(b){b.classList.remove('active');});
        tab.classList.add('active');
        var y=tab.dataset.year;
        grid.querySelectorAll('.year-block').forEach(function(p){
          p.style.display=(y==='all'||p.dataset.year===y)?'':'none';
        });
      });
    });
  }

  // 행사별 접기/펼치기 (기본: 펼침)
  if(grid){
    grid.querySelectorAll('.event-title').forEach(function(t){
      t.setAttribute('tabindex','0');
      t.setAttribute('role','button');
      t.setAttribute('aria-expanded','true');
      function toggle(){
        var ev=t.parentElement;
        ev.classList.toggle('collapsed');
        t.setAttribute('aria-expanded', ev.classList.contains('collapsed')?'false':'true');
      }
      t.addEventListener('click',toggle);
      t.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
      });
    });
  }

  // 사진 확대 보기 (라이트박스) — 닫기·이전·다음
  if(grid){
    var lb=document.createElement('div');
    lb.className='lightbox';
    lb.innerHTML=
      '<button class="lb-close" aria-label="닫기">✕</button>'+
      '<button class="lb-prev" aria-label="이전 사진">‹</button>'+
      '<img class="lb-img" src="" alt="">'+
      '<button class="lb-next" aria-label="다음 사진">›</button>'+
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('.lb-img');
    var lbCount=lb.querySelector('.lb-count');
    var items=[], idx=0;
    function render(){
      var a=items[idx];
      lbImg.src=a.getAttribute('href');
      lbImg.alt=(a.querySelector('img')||{}).alt||'';
      lbCount.textContent=(idx+1)+' / '+items.length;
    }
    function openAt(a){
      items=[].slice.call(grid.querySelectorAll('a.thumb')).filter(function(t){return t.offsetParent!==null;});
      idx=items.indexOf(a);
      if(idx<0)return;
      render();
      lb.classList.add('open');
      document.body.style.overflow='hidden';
    }
    function closeLb(){lb.classList.remove('open');lbImg.src='';document.body.style.overflow='';}
    function prev(){idx=(idx-1+items.length)%items.length;render();}
    function next(){idx=(idx+1)%items.length;render();}
    grid.addEventListener('click',function(e){
      var a=e.target.closest('a.thumb');
      if(!a)return;
      e.preventDefault();
      openAt(a);
    });
    lb.querySelector('.lb-close').addEventListener('click',closeLb);
    lb.querySelector('.lb-prev').addEventListener('click',function(e){e.stopPropagation();prev();});
    lb.querySelector('.lb-next').addEventListener('click',function(e){e.stopPropagation();next();});
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')closeLb();
      else if(e.key==='ArrowLeft')prev();
      else if(e.key==='ArrowRight')next();
    });
  }
});
