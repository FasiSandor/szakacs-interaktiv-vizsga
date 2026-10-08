"use client";

import {useMemo,useState} from "react";

type Q={
  id:number;
  topic:string;
  level:1|2|3;
  type:"single"|"multi"|"truefalse"|"number";
  text:string;
  options?:string[];
  answer:string|string[];
  explain:string;
  unit?:string;
};

const BANK:Q[]=[
{id:1,topic:"Konyhatechnológia",level:1,type:"single",text:"Melyik sűrítési eljárásnál készül lisztből és zsiradékból hőkezeléssel alap?",options:["Habarás","Rántás","Hintés","Legírozás"],answer:"Rántás",explain:"A rántás liszt és zsiradék hőkezelésével készülő sűrítési eljárás."},
{id:2,topic:"Konyhatechnológia",level:1,type:"multi",text:"Jelöld ki a hőközlési műveleteket!",options:["Főzés","Párolás","Sütés","Mosás","Darabolás"],answer:["Főzés","Párolás","Sütés"],explain:"A főzés, párolás és sütés hőközlési művelet."},
{id:3,topic:"Élelmiszerbiztonság",level:1,type:"truefalse",text:"A kézmosás elhagyható, ha a szakács egyszer használatos kesztyűt visel.",options:["Igaz","Hamis"],answer:"Hamis",explain:"A kesztyű nem helyettesíti a megfelelő kézhigiéniát."},
{id:4,topic:"Nyersanyagismeret",level:1,type:"single",text:"Melyik marhahúsrész alkalmas rövid idejű hőkezelésre is?",options:["Bélszín","Lábszár","Szegy","Nyak"],answer:"Bélszín",explain:"A bélszín finom rostozatú és puha húsrész."},
{id:5,topic:"Gazdasági számítások",level:1,type:"number",text:"Egy adag nettó nyersanyagértéke 1 250 Ft. Mennyi 4 adag nettó nyersanyagértéke?",answer:"5000",explain:"1 250 × 4 = 5 000 Ft.",unit:"Ft"},
{id:6,topic:"Gazdasági számítások",level:2,type:"number",text:"5 kg burgonya tisztítási vesztesége 18%. Hány kg tisztított burgonya marad?",answer:"4.1",explain:"5 × 0,82 = 4,10 kg.",unit:"kg"},
{id:7,topic:"Levesek",level:1,type:"single",text:"Melyik levescsoportra jellemző a rántással vagy habarással történő sűrítés?",options:["Sűrített levesek","Híg levesek","Alaplevek","Gyümölcslevek"],answer:"Sűrített levesek",explain:"A sűrített levesek állományát valamilyen sűrítési eljárással alakítjuk ki."},
{id:8,topic:"Főzelékek",level:1,type:"single",text:"Mi a főzelékek egyik legfontosabb állományi jellemzője?",options:["Szaftos, megfelelően sűrű","Teljesen száraz","Mindig pépes","Mindig híg"],answer:"Szaftos, megfelelően sűrű",explain:"A főzelék szaftos, de nem leveses vagy pépes."},
{id:9,topic:"Mártások",level:2,type:"single",text:"Melyik tartozik a klasszikus alapmártások közé?",options:["Besamel","Tartár","Remulád","Ezersziget"],answer:"Besamel",explain:"A besamel klasszikus fehér alapmártás."},
{id:10,topic:"Saláták",level:1,type:"truefalse",text:"A friss salátákat célszerű közvetlenül tálalás előtt összekeverni az öntettel.",options:["Igaz","Hamis"],answer:"Igaz",explain:"Így kevésbé esnek össze és jobb marad az állományuk."},
{id:11,topic:"Halak",level:2,type:"single",text:"Miért kell különösen ügyelni a halak hőkezelési idejére?",options:["Gyorsan kiszáradhatnak","Mindig hosszú főzést igényelnek","Csak fagyasztva süthetők","Mindig egy órán át kell sütni"],answer:"Gyorsan kiszáradhatnak",explain:"A halhús gyorsan elkészül, túl hosszú hőkezelésnél könnyen kiszárad."},
{id:12,topic:"Tálalás",level:2,type:"multi",text:"Mely szempontok fontosak a szakszerű tálalásnál?",options:["Megfelelő hőmérséklet","Tiszta tányérperem","Arányos adagolás","Minél több dísz mindenáron"],answer:["Megfelelő hőmérséklet","Tiszta tányérperem","Arányos adagolás"],explain:"A tálalás legyen tiszta, arányos és az ételnek megfelelő hőmérsékletű."},
{id:13,topic:"Raktározás",level:1,type:"single",text:"Mit jelent a FIFO elv?",options:["A korábban beérkezett készletet használjuk fel előbb","A drágább terméket használjuk fel előbb","A legnagyobb csomagolást bontjuk fel előbb","Mindent egyszerre használunk"],answer:"A korábban beérkezett készletet használjuk fel előbb",explain:"FIFO = First In, First Out."},
{id:14,topic:"Eszközismeret",level:1,type:"single",text:"Melyik eszköz alkalmas maghőmérséklet ellenőrzésére?",options:["Maghőmérő","Mérőhenger","Habverő","Szűrőkanál"],answer:"Maghőmérő",explain:"A maghőmérő az étel belsejében kialakult hőmérséklet mérésére szolgál."},
{id:15,topic:"Gazdasági számítások",level:2,type:"number",text:"Egy étel nettó eladási ára 2 400 Ft, az ÁFA 5%. Mennyi a bruttó eladási ár?",answer:"2520",explain:"2 400 × 1,05 = 2 520 Ft.",unit:"Ft"},
{id:16,topic:"Konyhatechnológia",level:3,type:"multi",text:"Mely műveletek befolyásolhatják egy mártás végső állományát?",options:["Sűrítés","Redukálás","Montírozás","Tálca előmelegítése","Evőeszköz polírozása"],answer:["Sűrítés","Redukálás","Montírozás"],explain:"Mindhárom eljárás közvetlenül hat a mártás koncentrációjára vagy textúrájára."}
];

function shuffle<T>(a:T[]){return [...a].sort(()=>Math.random()-.5)}
function ok(q:Q,a:any){
  if(a===undefined)return false;
  if(q.type==="multi"){
    const x=[...(Array.isArray(a)?a:[])].sort();
    const y=[...(q.answer as string[])].sort();
    return JSON.stringify(x)===JSON.stringify(y);
  }
  if(q.type==="number"){
    return Math.abs(Number(String(a).replace(",","."))-Number(q.answer))<0.011;
  }
  return a===q.answer;
}

export default function Page(){
  const [screen,setScreen]=useState<"home"|"quiz"|"result">("home");
  const [mode,setMode]=useState<"practice"|"exam">("practice");
  const [round,setRound]=useState<Q[]>([]);
  const [i,setI]=useState(0);
  const [answers,setAnswers]=useState<Record<number,any>>({});
  const [checked,setChecked]=useState<Record<number,boolean>>({});
  const q=round[i];
  const score=useMemo(()=>round.filter(x=>ok(x,answers[x.id])).length,[round,answers]);

  function start(m:"practice"|"exam"){
    setMode(m);setRound(shuffle(BANK).slice(0,m==="practice"?10:16));setI(0);setAnswers({});setChecked({});setScreen("quiz");
  }
  function choose(v:string){
    if(mode==="practice"&&checked[q.id])return;
    if(q.type==="multi"){
      const old=Array.isArray(answers[q.id])?answers[q.id]:[];
      setAnswers({...answers,[q.id]:old.includes(v)?old.filter((x:string)=>x!==v):[...old,v]});
    }else setAnswers({...answers,[q.id]:v});
  }
  function next(){if(i===round.length-1)setScreen("result");else setI(i+1)}
  function reset(){setScreen("home");setRound([]);setAnswers({});setChecked({});setI(0)}

  if(screen==="home")return <main className="wrap">
    <header className="top"><div className="logo">SZ</div><div><span>INTERAKTÍV FELKÉSZÍTŐ</span><b>Szakács Vizsga</b></div><em>● ONLINE</em></header>
    <section className="hero">
      <div><small>VIZSGAFELKÉSZÍTŐ RENDSZER</small><h1>Gyakorolj úgy,<br/>ahogy a vizsgán.</h1><p>Véletlen feladatsorok, többféle kérdéstípus, azonnali magyarázat és újragenerálható tesztek.</p></div>
      <div className="metric"><strong>{BANK.length}</strong><span>induló kérdés</span><p>A kérdésbank folyamatosan bővíthető.</p></div>
    </section>
    <section className="cards">
      <button className="card primary" onClick={()=>start("practice")}><i>▶</i><div><b>Gyors gyakorlás</b><span>10 véletlen kérdés • azonnali javítás</span></div><strong>→</strong></button>
      <button className="card" onClick={()=>start("exam")}><i>◎</i><div><b>Próbavizsga</b><span>16 kérdés • eredmény a végén</span></div><strong>→</strong></button>
    </section>
    <section className="panel"><div><span>TÉMAKÖRÖK</span><b>Nyersanyag • technológia • számítás • higiénia • tálalás</b></div><button onClick={()=>start("practice")}>Új feladatsor</button></section>
    <section className="stats"><div><b>4</b><span>feladattípus</span></div><div><b>∞</b><span>új sorrend</span></div><div><b>3</b><span>nehézségi szint</span></div></section>
  </main>;

  if(screen==="result"){
    const pct=Math.round(score/round.length*100);
    return <main className="wrap">
      <header className="top"><button className="ghost" onClick={reset}>← Kezdőlap</button><em>EREDMÉNY</em></header>
      <section className="result"><div className="ring"><strong>{pct}%</strong><span>{score}/{round.length} helyes</span></div><div><span className="blue">TELJESÍTMÉNY</span><h1>{pct>=80?"Nagyon jó eredmény.":pct>=60?"Jó alap, gyakorolj tovább.":"Nézd át a hibákat és próbáld újra."}</h1><div className="actions"><button onClick={()=>start(mode)}>Új feladatsor</button><button className="ghost" onClick={reset}>Másik mód</button></div></div></section>
      <section className="review">{round.map((x,n)=><article key={x.id} className={ok(x,answers[x.id])?"good":"bad"}><i>{n+1}</i><div><b>{x.text}</b><span>{ok(x,answers[x.id])?"Helyes":"Hibás"} • Helyes válasz: {Array.isArray(x.answer)?x.answer.join(", "):x.answer} {x.unit||""}</span><p>{x.explain}</p></div></article>)}</section>
    </main>;
  }

  const answered=q&&answers[q.id]!==undefined&&(Array.isArray(answers[q.id])?answers[q.id].length>0:String(answers[q.id]).length>0);
  const feedback=mode==="practice"&&checked[q.id];

  return <main className="wrap">
    <header className="examtop"><button className="ghost" onClick={reset}>✕ Kilépés</button><div><span>{mode==="exam"?"PRÓBAVIZSGA":"GYORS GYAKORLÁS"}</span><b>{i+1} / {round.length}</b></div></header>
    <div className="progress"><i style={{width:String((i+1)/round.length*100)+"%"}}/></div>
    <div className="layout">
      <section className="question">
        <div className="meta"><span>{q.topic}</span><em>{q.level===1?"ALAP":q.level===2?"KÖZEPES":"HALADÓ"}</em></div>
        <h1>{q.text}</h1>
        {q.type==="number"?<div className="num"><input inputMode="decimal" placeholder="Írd be az eredményt" value={answers[q.id]||""} onChange={e=>choose(e.target.value)}/><span>{q.unit}</span></div>:
        <div className="options">{(q.options||[]).map((o,n)=>{const selected=q.type==="multi"?Array.isArray(answers[q.id])&&answers[q.id].includes(o):answers[q.id]===o;return <button key={o} className={selected?"selected":""} onClick={()=>choose(o)}><i>{String.fromCharCode(65+n)}</i><span>{o}</span><b>{selected?"✓":""}</b></button>})}</div>}
        {feedback&&<div className={ok(q,answers[q.id])?"feedback good":"feedback bad"}><b>{ok(q,answers[q.id])?"✓ Helyes válasz":"✕ Ez most nem jó"}</b><p>{q.explain}</p></div>}
        <div className="nav"><button className="ghost" disabled={i===0} onClick={()=>setI(Math.max(0,i-1))}>← Előző</button>{mode==="practice"&&!checked[q.id]?<button disabled={!answered} onClick={()=>setChecked({...checked,[q.id]:true})}>Ellenőrzés</button>:<button disabled={!answered&&mode==="exam"} onClick={next}>{i===round.length-1?"Befejezés":"Következő →"}</button>}</div>
      </section>
      <aside><div><span>Feladatok</span><b>{Object.keys(answers).length}/{round.length}</b></div><section>{round.map((x,n)=><button key={x.id} onClick={()=>setI(n)} className={(n===i?"active ":"")+(answers[x.id]!==undefined?"done":"")}>{n+1}</button>)}</section></aside>
    </div>
  </main>;
}