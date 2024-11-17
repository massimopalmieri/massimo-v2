import type {ReactNode} from 'react'
import data from '~/data.json'

function SectionTitle({children}: {children: ReactNode}) {
  return (
    <h2 className="mb-0 inline-block bg-yellow-400 px-10 py-6 text-4xl font-thin md:-ml-24">
      {children}
    </h2>
  )
}

export default function Index() {
  return (
    <div className="relative mb-6">
      <div className="sticky top-0 mt-0 bg-zinc-900/75 px-4 py-8 backdrop-blur-xl sm:mb-16 sm:mt-24 md:px-0">
        <div className="prose mx-auto">
          <h1 className="text-6xl font-thin text-gray-100">
            Massimo <span className="font-normal">Palmieri</span>
          </h1>
        </div>
      </div>

      <div className="prose mx-auto p-4 text-slate-300 prose-h3:text-yellow-400 prose-lead:text-gray-200">
        <SectionTitle>Professional summary</SectionTitle>
        <p className="lead mt-12 font-serif">
          Welcome to my online curriculum vitae. I am a highly experienced web
          developer with over 15 years of commercial experience in the industry.
          My expertise lies in JavaScript/Typescript, CSS, Node.js, and other
          web development technologies. I have a wealth of knowledge across
          various industries, including startups, advertising agencies, banks,
          and SaaS companies. In addition, I possess a proven track record of
          success in building and managing teams and executing projects using
          agile methodologies.
        </p>
        <p className="lead font-serif">
          I am always seeking new challenges and opportunities to expand my
          skills and advance my career in the field of web development. Please
          take the time to review my CV and learn more about my experience.
        </p>

        <SectionTitle>Skills</SectionTitle>
        <div className="mt-12">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="m-2 inline-block text-sm font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>

        <SectionTitle>Work history</SectionTitle>

        {data.history.map((item) => (
          <>
            <h3 className="mt-12 mb-2 overflow-hidden">
              {item.employer} - {item.title}
            </h3>
            <p className="mt-2 mb-4 text-sm font-semibold text-gray-500">
              {formatter.format(new Date(item.start))} —{' '}
              {item.end ? formatter.format(new Date(item.end)) : 'Present'}
            </p>
            <ul className="list-inside pl-0 font-serif md:list-outside">
              {item.achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ))}

        <SectionTitle>Education</SectionTitle>

        <div className="mt-12">
          {data.education.map((item) => (
            <div key={item.title}>
              <div>
                {item.year} -{' '}
                <span className="font-semibold">{item.school}</span>
              </div>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
