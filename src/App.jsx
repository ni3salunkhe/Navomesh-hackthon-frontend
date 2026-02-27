function App() {
    return (
        <div className="min-h-screen bg-surface-950 text-white overflow-hidden">
            {/* ── Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface-950/70 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-sm">
                            N
                        </div>
                        <span className="text-lg font-semibold tracking-tight">Navomesh</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-surface-200">
                        <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
                        <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
                        <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
                    </div>
                    <button className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/25">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
                {/* Background gradient orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] animate-float" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                            IMCC Hackathon 2026
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight animate-fade-in-delay">
                        Build the Future with{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                            Navomesh
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-surface-200 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2">
                        A modern, blazing-fast web application built with React and Tailwind CSS.
                        Designed for performance, crafted for excellence.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
                        <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/30 hover:scale-105 animate-pulse-glow">
                            Launch App
                        </button>
                        <button className="px-8 py-3.5 rounded-full border border-white/10 hover:border-white/25 text-surface-200 hover:text-white font-medium transition-all duration-300 hover:bg-white/5">
                            Learn More →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Why <span className="text-primary-400">Navomesh</span>?
                        </h2>
                        <p className="mt-4 text-surface-200 max-w-xl mx-auto">
                            Powerful features designed to accelerate your workflow and deliver exceptional results.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '⚡',
                                title: 'Lightning Fast',
                                description: 'Built on Vite for instant hot module replacement and blazing-fast builds.',
                            },
                            {
                                icon: '🎨',
                                title: 'Beautiful Design',
                                description: 'Tailwind CSS v4 with a custom design system for stunning, consistent UIs.',
                            },
                            {
                                icon: '🚀',
                                title: 'Production Ready',
                                description: 'Optimized for deployment on Render with zero-config static hosting.',
                            },
                            {
                                icon: '🔒',
                                title: 'Secure by Default',
                                description: 'Built with modern security best practices and CSP-ready configuration.',
                            },
                            {
                                icon: '📱',
                                title: 'Fully Responsive',
                                description: 'Pixel-perfect layouts across all devices, from mobile to ultrawide monitors.',
                            },
                            {
                                icon: '🧩',
                                title: 'Modular Architecture',
                                description: 'Component-based structure for easy maintenance and scalability.',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-surface-900/50 border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:bg-surface-800/50 hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-surface-200 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="py-20 px-6 border-y border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '100%', label: 'Open Source' },
                        { value: '<1s', label: 'Build Time' },
                        { value: 'A+', label: 'Lighthouse Score' },
                        { value: '0', label: 'Dependencies Issues' },
                    ].map((stat, index) => (
                        <div key={index}>
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="mt-2 text-sm text-surface-200">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section id="contact" className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Ready to get started?
                    </h2>
                    <p className="mt-4 text-surface-200 max-w-lg mx-auto">
                        Join us in building something amazing for the IMCC Hackathon. Let&apos;s create the future together.
                    </p>
                    <button className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/30 hover:scale-105">
                        Start Building →
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-surface-200">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-[10px]">
                            N
                        </div>
                        <span className="font-medium text-white">Navomesh</span>
                    </div>
                    <p>© 2026 Navomesh. Built for IMCC Hackathon.</p>
                </div>
            </footer>
        </div>
    )
}

export default App
