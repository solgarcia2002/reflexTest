

export default function Home() {
  return (
    <main className=" fixed p-0 h-screen w-screen " style={{background: 'transparent linear-gradient(90deg, #00BF6F 0%, #009D85 100%) 0% 0% no-repeat padding-box'}}>
       <video autoPlay={true} loop className="h-screen w-screen" muted>
        <source src='/video-home.mp4'/>
      </video>
     <h1 className="fixed mt-[-30%] ms-[6%] max-w-[50%] text-5xl text-white uppercase">AI-driven, human-hearted: Train to be the whisper of hope that feels like a hand to hold.</h1>
    </main>
  );
}
