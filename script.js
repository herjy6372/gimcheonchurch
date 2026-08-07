// 모바일 메뉴 토글
function toggleMenu(){var m=document.getElementById('menu');if(m)m.classList.toggle('open');}
function closeMenu(){var m=document.getElementById('menu');if(m)m.classList.remove('open');}

// 생년월일 선택 UI: 년/월/일 드롭다운 채우기 (회원가입·정보수정에서 공용으로 사용)
function fillBirthSelects(yearEl, monthEl, dayEl, isoDate){
  var nowYear = new Date().getFullYear();
  var yOpts = '<option value="" disabled selected>년</option>';
  for(var y=nowYear; y>=nowYear-99; y--){ yOpts += '<option value="'+y+'">'+y+'년</option>'; }
  yearEl.innerHTML = yOpts;
  var mOpts = '<option value="" disabled selected>월</option>';
  for(var m=1; m<=12; m++){ mOpts += '<option value="'+m+'">'+m+'월</option>'; }
  monthEl.innerHTML = mOpts;
  function fillDays(){
    var yy = Number(yearEl.value) || nowYear;
    var mm = Number(monthEl.value) || 1;
    var daysInMonth = new Date(yy, mm, 0).getDate();
    var keep = dayEl.value;
    var dOpts = '<option value="" disabled selected>일</option>';
    for(var d=1; d<=daysInMonth; d++){ dOpts += '<option value="'+d+'">'+d+'일</option>'; }
    dayEl.innerHTML = dOpts;
    if(keep && Number(keep)<=daysInMonth) dayEl.value = keep;
  }
  yearEl.addEventListener('change', fillDays);
  monthEl.addEventListener('change', fillDays);
  fillDays();
  if(isoDate){
    var parts = isoDate.split('-');
    if(parts[0]) yearEl.value = String(Number(parts[0]));
    if(parts[1]) monthEl.value = String(Number(parts[1]));
    fillDays();
    if(parts[2]) dayEl.value = String(Number(parts[2]));
  }
}
function readBirthValue(yearEl, monthEl, dayEl){
  var y=yearEl.value, m=monthEl.value, d=dayEl.value;
  if(!y||!m||!d) return "";
  return y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
}

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
      '<button class="lb-play" aria-label="자동재생">▶</button>'+
      '<button class="lb-prev" aria-label="이전 사진">‹</button>'+
      '<img class="lb-img" src="" alt="">'+
      '<button class="lb-next" aria-label="다음 사진">›</button>'+
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('.lb-img');
    var lbCount=lb.querySelector('.lb-count');
    var lbPlay=lb.querySelector('.lb-play');
    var items=[], idx=0;
    var playTimer=null, playing=false;
    function render(){
      var a=items[idx];
      lbImg.src=a.getAttribute('href');
      lbImg.alt=(a.querySelector('img')||{}).alt||'';
      lbCount.textContent=(idx+1)+' / '+items.length;
    }
    function stopPlay(){
      playing=false;
      clearInterval(playTimer);
      lbPlay.textContent='▶';
      lbPlay.setAttribute('aria-label','자동재생');
    }
    function startPlay(){
      playing=true;
      lbPlay.textContent='⏸';
      lbPlay.setAttribute('aria-label','정지');
      playTimer=setInterval(function(){
        if(idx>=items.length-1){ stopPlay(); return; }
        next();
      },2500);
    }
    function openAt(a){
      stopPlay();
      items=[].slice.call(grid.querySelectorAll('a.thumb')).filter(function(t){return t.offsetParent!==null;});
      idx=items.indexOf(a);
      if(idx<0)return;
      render();
      lb.classList.add('open');
      document.body.style.overflow='hidden';
    }
    function closeLb(){stopPlay();lb.classList.remove('open');lbImg.src='';document.body.style.overflow='';}
    function prev(){idx=(idx-1+items.length)%items.length;render();}
    function next(){idx=(idx+1)%items.length;render();}
    grid.addEventListener('click',function(e){
      var a=e.target.closest('a.thumb');
      if(!a)return;
      e.preventDefault();
      openAt(a);
    });
    lb.querySelector('.lb-close').addEventListener('click',closeLb);
    lb.querySelector('.lb-prev').addEventListener('click',function(e){e.stopPropagation();stopPlay();prev();});
    lb.querySelector('.lb-next').addEventListener('click',function(e){e.stopPropagation();stopPlay();next();});
    lbPlay.addEventListener('click',function(e){e.stopPropagation();playing?stopPlay():startPlay();});
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')closeLb();
      else if(e.key==='ArrowLeft'){stopPlay();prev();}
      else if(e.key==='ArrowRight'){stopPlay();next();}
    });

    // 제목(행사)과 상관없이 첫 사진부터 마지막 사진까지 자동 재생
    var slideshowBtn=document.getElementById('slideshowBtn');
    if(slideshowBtn){
      slideshowBtn.addEventListener('click',function(){
        var allTab=document.querySelector('#yearTabs button[data-year="all"]');
        if(allTab) allTab.click();
        var firstThumb=grid.querySelector('a.thumb');
        if(firstThumb){ openAt(firstThumb); startPlay(); }
      });
    }

    // 우클릭/드래그로 사진 저장 방지 — 다운로드는 아래 다운로드 버튼으로만
    grid.addEventListener('contextmenu',function(e){
      if(e.target.closest('a.thumb, img')) e.preventDefault();
    });
    grid.querySelectorAll('img').forEach(function(img){ img.setAttribute('draggable','false'); });
    lbImg.setAttribute('draggable','false');
    lb.addEventListener('contextmenu',function(e){
      if(e.target===lbImg) e.preventDefault();
    });

    // 사진 다운로드 (전체 / 행사별) — ZIP으로 묶어서 다운로드
    var downloadProgress=document.getElementById('downloadProgress');
    var downloadProgressText=document.getElementById('downloadProgressText');
    var downloadCancelBtn=document.getElementById('downloadCancelBtn');
    var downloadCancelled=false;

    function sanitizeName(s){
      var n=(s||'앨범').replace(/[\\/:*?"<>|]/g,'_').trim();
      return (n||'앨범').slice(0,80);
    }
    function eventTitleFor(a){
      var ev=a.closest('.event');
      var t=ev && ev.querySelector('.event-title strong');
      return t? t.textContent.trim() : '기타';
    }
    function showProgress(done,total){
      downloadProgress.style.display='block';
      downloadProgressText.textContent='다운로드 중… ('+done+' / '+total+')';
    }
    function hideProgress(){ downloadProgress.style.display='none'; }

    async function downloadZip(thumbs, zipFilename, groupByEvent){
      if(typeof JSZip==='undefined'){ alert('다운로드 기능을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'); return; }
      if(!thumbs.length){ alert('다운로드할 사진이 없습니다.'); return; }
      downloadCancelled=false;
      downloadCancelBtn.style.display='inline-block';
      var zip=new JSZip();
      var counters={};
      var total=thumbs.length;
      showProgress(0,total);
      for(var i=0;i<total;i++){
        if(downloadCancelled) break;
        var a=thumbs[i];
        var url=a.getAttribute('href');
        var ext=(url.split('.').pop()||'jpg').toLowerCase();
        var name;
        if(groupByEvent){
          var title=sanitizeName(eventTitleFor(a));
          counters[title]=(counters[title]||0)+1;
          name=title+'/'+String(counters[title]).padStart(2,'0')+'.'+ext;
        }else{
          counters._=(counters._||0)+1;
          name=String(counters._).padStart(2,'0')+'.'+ext;
        }
        try{
          var resp=await fetch(url);
          if(resp.ok){ zip.file(name, await resp.blob()); }
        }catch(e){ /* 개별 사진 실패는 건너뛰고 계속 진행 */ }
        showProgress(i+1,total);
      }
      downloadCancelBtn.style.display='none';
      if(downloadCancelled){ hideProgress(); return; }
      downloadProgressText.textContent='압축 파일 만드는 중…';
      var content=await zip.generateAsync({type:'blob', compression:'STORE'});
      var link=document.createElement('a');
      link.href=URL.createObjectURL(content);
      link.download=zipFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      hideProgress();
    }

    if(downloadCancelBtn){
      downloadCancelBtn.addEventListener('click',function(){ downloadCancelled=true; });
    }

    var downloadAllBtn=document.getElementById('downloadAllBtn');
    if(downloadAllBtn){
      downloadAllBtn.addEventListener('click',function(){
        var all=[].slice.call(grid.querySelectorAll('a.thumb'));
        if(!confirm('전체 사진 '+all.length+'장을 다운로드합니다. 용량이 크고 시간이 오래 걸릴 수 있습니다. 계속할까요?')) return;
        downloadZip(all, '김천침례교회_사진첩_전체.zip', true);
      });
    }

    // 행사별 다운로드 버튼을 각 제목 옆에 추가
    grid.querySelectorAll('.event').forEach(function(ev){
      var titleEl=ev.querySelector('.event-title');
      var thumbs=[].slice.call(ev.querySelectorAll('.thumb-grid a.thumb'));
      if(!titleEl || !thumbs.length) return;
      var dbtn=document.createElement('button');
      dbtn.type='button';
      dbtn.className='event-download-btn';
      dbtn.textContent='⬇ 다운로드';
      dbtn.setAttribute('aria-label','이 행사 사진 다운로드');
      dbtn.addEventListener('click',function(e){
        e.stopPropagation();
        var strongEl=titleEl.querySelector('strong');
        var name=sanitizeName(strongEl? strongEl.textContent.trim() : '앨범')+'.zip';
        downloadZip(thumbs, name, false);
      });
      titleEl.appendChild(dbtn);
    });
  }
});
