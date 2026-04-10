function Hero({ title, description }) {
  return (
    <section className="px-4.5 pt-9 pb-4.5 sm:pt-12">
      <div className="max-w-4xl mx-auto p-4.5 sm:p-7 bg-gradient-to-b from-white to-blue-50 border border-line rounded-3xl shadow-sm">
        <div className="inline-block mb-2.5 px-3 py-1.5 rounded-full bg-primary-soft border border-blue-200 text-primary-strong font-black text-xs uppercase tracking-wider">
          Galeri Video
        </div>
        <h1 className="m-0 font-baloo text-3xl sm:text-4xl md:text-5xl leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-2xl text-text-muted text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export default Hero;
