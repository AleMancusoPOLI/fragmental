import Dropzone from "./components/Dropzone";

export default function Home() {
  return (
    <section className="section">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p>ACTAM sick crazy granulizer project!!!</p>
        <div className="rounded-sm border-solid border-4 border-black">
          <div className="m-4">
            <Dropzone></Dropzone>
            <p>- Parameteres</p>
          </div>
        </div>
      </div>
    </section>
  );
}
