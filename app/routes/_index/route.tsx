import {type ReactNode, useRef, useState, useEffect} from 'react'
import data from '~/data.json'
import {motion} from 'framer-motion'
import {z} from 'zod'
import {useFetcher, useRouteLoaderData} from 'react-router'
import type {loader} from '~/root'
import {trackEvent} from '~/utils/analytics'
import {isChristmasSeason} from '~/utils/dates'
import type {action} from '../api.contact/route'
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3'
import invariant from 'tiny-invariant'
import {useTheme} from '~/utils/theme'

const formatter = new Intl.DateTimeFormat('en-GB', {
	month: 'short',
	year: 'numeric',
})

const contactSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().min(1, 'Email is required').email('Invalid email address'),
	message: z.string().min(1, 'Message is required'),
})

type ContactForm = z.infer<typeof contactSchema>

function SectionTitle({children}: {children: ReactNode}) {
	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			whileInView={{opacity: 1, y: 0}}
			viewport={{once: true}}
			className="mb-16 flex items-center gap-4"
		>
			<h2 className="text-base uppercase tracking-wider text-zinc-500 dark:text-white/40">
				{children}
			</h2>
			<div className="h-px flex-1 bg-linear-to-r from-accent/20 to-transparent" />
		</motion.div>
	)
}

function SnowAnimation() {
	return (
		<div className="fixed inset-0 pointer-events-none z-50">
			{[...Array(50)].map((_, i) => {
				// Calculate depth factor (0 to 1)
				const depth = Math.random()
				return (
					<div
						suppressHydrationWarning={true}
						key={i}
						className="snow"
						style={
							{
								'--size': `${Math.random() * 8 + 4}px`,
								'--left': `${Math.random() * 100}vw`,
								'--delay': `${Math.random() * 5}s`,
								'--duration': `${Math.random() * 3 + 2}s`,
								'--drift': `${Math.random() * 20 - 10}`,
								'--opacity': depth * 0.5 + 0.1, // 0.1 to 0.6 opacity
								'--blur': `${(1 - depth) * 3}px`, // 0px to 3px blur
							} as React.CSSProperties
						}
					/>
				)
			})}
		</div>
	)
}

export default function Index() {
	const fetcher = useFetcher<typeof action>()
	const formRef = useRef<HTMLFormElement>(null)
	const [errors, setErrors] = useState<
		Partial<Record<keyof ContactForm, string>>
	>({})
	const [isSuccess, setIsSuccess] = useState(false)
	const rootLoaderData = useRouteLoaderData<typeof loader>('root')
	invariant(rootLoaderData, 'Root loader data is undefined')
	const {RECAPTCHA_SITE_KEY} = rootLoaderData.ENV
	const {theme, toggleTheme} = useTheme()

	const validateField = (name: keyof ContactForm, value: string) => {
		const result = contactSchema.shape[name].safeParse(value)
		if (!result.success) {
			setErrors((prev) => ({
				...prev,
				[name]: result.error.issues[0].message,
			}))
		} else {
			setErrors((prev) => {
				const newErrors = {...prev}
				delete newErrors[name]
				return newErrors
			})
		}
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		const form = event.target as HTMLFormElement
		if (!form) return

		setErrors({})
		setIsSuccess(false)

		try {
			// Get reCAPTCHA token if site key exists
			let recaptchaToken = ''

			try {
				recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
					action: 'submit',
				})
			} catch (error) {
				console.error('reCAPTCHA error:', error)
				return
			}

			const formData = new FormData(form)
			// Add recaptcha token to form data if we have it
			if (recaptchaToken) {
				formData.append('recaptchaToken', recaptchaToken)
			}

			const formObject = Object.fromEntries(formData)
			const result = contactSchema.safeParse(formObject)

			if (!result.success) {
				const formattedErrors: Partial<Record<keyof ContactForm, string>> = {}
				result.error.issues.forEach((issue) => {
					const path = issue.path[0] as keyof ContactForm
					formattedErrors[path] = issue.message
				})
				setErrors(formattedErrors)
				return
			}

			// Track successful form submission
			trackEvent('form_submit', {
				type: 'contact_form',
				value: 'success',
			})

			fetcher.submit(formData, {
				method: 'POST',
				action: '/api/contact',
			})
		} catch (error) {
			// Track form errors
			trackEvent('form_error', {
				type: 'contact_form',
				value: error instanceof Error ? error.message : 'Unknown error',
			})
			console.error('Form submission error:', error)
		}
	}

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.success) {
			formRef.current?.reset()
			setIsSuccess(true)
		}
	}, [fetcher.state, fetcher.data])

	useEffect(() => {
		if (!RECAPTCHA_SITE_KEY) return

		const script = document.createElement('script')
		script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [RECAPTCHA_SITE_KEY])

	return (
		<div
			className="relative min-h-screen bg-white dark:bg-zinc-950 selection:bg-accent/30"
			style={{
				WebkitTapHighlightColor: 'transparent',
			}}
		>
			{isChristmasSeason() && <SnowAnimation />}
			{/* Enhanced background gradients */}
			<div className="pointer-events-none fixed inset-0">
				{/* Main gradient */}
				<div className="absolute inset-0 bg-gradient-radial-hero dark:opacity-100 opacity-50" />

				{/* Secondary subtle gradients */}
				<div
					className="absolute inset-0"
					style={{
						background: `
              radial-gradient(
                circle at 20% 50%,
                rgba(120, 119, 198, 0.03) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 80%,
                rgba(120, 119, 198, 0.03) 0%,
                transparent 50%
              )
            `,
					}}
				/>

				{/* Noise texture overlay */}
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{backgroundImage: 'url("/noise.png")'}}
				/>

				{/* Optional: Subtle vignette */}
				<div
					className="absolute inset-0"
					style={{
						background: `
              radial-gradient(
                circle at center,
                transparent 0%,
                rgba(0, 0, 0, 0.1) 100%
              )
            `,
					}}
				/>
			</div>

			<div className="relative mx-auto max-w-(--breakpoint-xl) px-6 pb-32">
				{/* Header */}
				<header className="relative min-h-screen">
					<div className="fixed top-8 right-8 z-50 flex items-center gap-4">
						<motion.button
							onClick={toggleTheme}
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							className="rounded-full bg-accent/20 p-3 text-accent transition-colors hover:bg-accent/30"
							aria-label={`Switch to ${
								theme === 'dark' ? 'light' : 'dark'
							} mode`}
						>
							{theme === 'dark' ? (
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							) : (
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
									/>
								</svg>
							)}
						</motion.button>
					</div>

					<div className="flex min-h-screen items-center justify-center">
						<motion.div
							initial={{opacity: 0, y: 20}}
							animate={{opacity: 1, y: 0}}
							transition={{delay: 0.2}}
							className="mx-auto max-w-3xl"
						>
							<h1 className="animate-gradient bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-white/50 dark:to-white bg-clip-text text-transparent text-[120px] font-semibold leading-none mb-8">
								<span className="block">Hello, I’m</span>
								<span className="block">Massimo</span>
							</h1>

							<div className="max-w-xl">
								<p className="text-lg font-light leading-relaxed text-zinc-600 dark:text-white/60">
									Senior Web Developer crafting high-performance applications
									with modern JavaScript. Passionate about clean architecture
									and exceptional user experiences.
								</p>
							</div>
						</motion.div>
					</div>
				</header>

				{/* Main Content */}
				<main className="mx-auto max-w-3xl space-y-32">
					{/* Skills section */}
					<section>
						<SectionTitle>Expertise</SectionTitle>

						<div className="relative overflow-hidden -mx-6 sm:-mx-12 md:-mx-24 lg:mx-[calc(-50vw+50%)]">
							<motion.div
								className="flex py-4"
								animate={{
									x: ['0%', '-200%'],
								}}
								transition={{
									x: {
										repeat: Infinity,
										repeatType: 'loop',
										duration: 40,
										ease: 'linear',
									},
								}}
							>
								{data.skills.map((skill, index) => (
									<div key={skill} className="group relative shrink-0 px-6">
										<div className="relative">
											<span className="font-mono text-xs text-accent/40">
												{String((index % data.skills.length) + 1).padStart(
													2,
													'0',
												)}
											</span>
											<h3 className="mt-2 text-5xl font-light tracking-tight text-zinc-700 dark:text-white/40 transition-colors duration-300 group-hover:text-zinc-900 dark:group-hover:text-white whitespace-nowrap">
												{skill}
											</h3>
										</div>
									</div>
								))}
							</motion.div>
						</div>
					</section>

					{/* Experience section - showing just the changes */}
					<section>
						<SectionTitle>Experience</SectionTitle>

						<div className="relative space-y-24">
							{/* Timeline line - keep it at exactly 180px */}
							<div className="absolute bottom-0 md:left-[180px] top-0 w-px bg-zinc-200 dark:bg-accent/20" />

							{data.history.map((job, index) => (
								<motion.article
									initial={{opacity: 0, y: 20}}
									whileInView={{opacity: 1, y: 0}}
									viewport={{once: true}}
									transition={{delay: index * 0.05}}
									key={index}
									className="group relative grid gap-8 md:grid-cols-[180px_1fr] ml-8 md:ml-0"
								>
									{/* Timeline dot - aligned to the center of the line */}
									<div className="absolute md:left-[177px] top-2.5 h-1.5 w-1.5 rounded-full bg-accent -ml-8 translate-x-[-2.5px] md:translate-x-0 md:ml-0" />

									<div className="relative space-y-1">
										<div className="font-mono text-xs text-accent/60">
											{formatter.format(new Date(job.start))} —{' '}
											{job.end
												? formatter.format(new Date(job.end))
												: 'Present'}
										</div>
										<div className="text-sm font-light text-zinc-600 dark:text-white/60">
											{job.title}
										</div>
									</div>

									<div>
										<h3 className="mb-6 text-lg font-light text-zinc-800 dark:text-white transition-colors">
											{job.employer}
										</h3>
										<ul className="space-y-3 text-zinc-600 dark:text-white/60">
											{job.achievements.map((achievement) => (
												<li
													key={achievement}
													className="relative flex gap-3 text-sm font-light"
												>
													<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
													{achievement}
												</li>
											))}
										</ul>
									</div>
								</motion.article>
							))}
						</div>
					</section>

					{/* Education section - similar updates to Experience section */}
					{/* ... */}

					<section>
						<SectionTitle>Contact</SectionTitle>

						<GoogleReCaptchaProvider
							reCaptchaKey={RECAPTCHA_SITE_KEY}
							scriptProps={{
								async: false,
								defer: true,
								appendTo: 'head',
								nonce: undefined,
							}}
						>
							<form
								ref={formRef}
								onSubmit={handleSubmit}
								className="mx-auto max-w-xl space-y-6"
							>
								{isSuccess && (
									<div className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-500">
										Thanks for your message! I’ll get back to you soon.
									</div>
								)}
								{fetcher.data?.error && (
									<div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
										{fetcher.data.error}
									</div>
								)}

								<div className="space-y-4">
									<div className="space-y-2">
										<label
											htmlFor="name"
											className="block text-sm font-light text-zinc-600 dark:text-white/60"
										>
											Name
										</label>
										<input
											id="name"
											name="name"
											type="text"
											autoComplete="name"
											onBlur={(event) =>
												validateField('name', event.target.value)
											}
											className="w-full rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-light text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/20 outline-hidden ring-accent/50 transition-shadow focus:ring-2"
											placeholder="Your name"
										/>
										{errors.name && (
											<span className="mt-2 block text-sm text-red-400">
												{errors.name}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<label
											htmlFor="email"
											className="block text-sm font-light text-zinc-600 dark:text-white/60"
										>
											Email
										</label>
										<input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											onBlur={(event) =>
												validateField('email', event.target.value)
											}
											className="w-full rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-light text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/20 outline-hidden ring-accent/50 transition-shadow focus:ring-2"
											placeholder="your@email.com"
										/>
										{errors.email && (
											<span className="mt-2 block text-sm text-red-400">
												{errors.email}
											</span>
										)}
									</div>

									<div className="space-y-2">
										<label
											htmlFor="message"
											className="block text-sm font-light text-zinc-600 dark:text-white/60"
										>
											Message
										</label>
										<textarea
											id="message"
											name="message"
											rows={5}
											onBlur={(event) =>
												validateField('message', event.target.value)
											}
											className="w-full rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-light text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/20 outline-hidden ring-accent/50 transition-shadow focus:ring-2"
											placeholder="Your message..."
										/>
										{errors.message && (
											<span className="mt-2 block text-sm text-red-400">
												{errors.message}
											</span>
										)}
									</div>
								</div>

								<button
									type="submit"
									disabled={fetcher.state !== 'idle'}
									className="rounded-lg bg-accent/10 px-8 py-3 text-sm font-light text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
								>
									{fetcher.state !== 'idle' ? 'Sending...' : 'Send Message'}
								</button>
							</form>
						</GoogleReCaptchaProvider>
					</section>
				</main>
			</div>
		</div>
	)
}
