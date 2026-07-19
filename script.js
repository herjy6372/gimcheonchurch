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
        grid.querySelectorAll('.photo').forEach(function(p){
          p.style.display=(y==='all'||p.dataset.year===y)?'':'none';
        });
      });
    });
  }
});
