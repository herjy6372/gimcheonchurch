// 모바일 메뉴 토글
function toggleMenu(){document.getElementById('menu').classList.toggle('open');}
function closeMenu(){var m=document.getElementById('menu');if(m)m.classList.remove('open');}

// 연도별 앨범 필터 (album.html 에서만 동작)
document.addEventListener('DOMContentLoaded',function(){
  var tabs=document.querySelectorAll('#yearTabs button');
  var grid=document.getElementById('albumGrid');
  if(!tabs.length||!grid)return;
  tabs.forEach(function(btn){
    btn.addEventListener('click',function(){
      tabs.forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      var y=btn.dataset.year;
      grid.querySelectorAll('.photo').forEach(function(p){
        p.style.display=(y==='all'||p.dataset.year===y)?'':'none';
      });
    });
  });
});
