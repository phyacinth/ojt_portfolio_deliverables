import { assets } from '../lib/assets'
import { Stars, VLine } from './Decor'

const groups = [
  { label: 'Front-End & Core Web', items: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'] },
  { label: 'Tools & Platforms', items: ['Figma', 'Visual Studio Code', 'Git/GitHub', 'Microsoft Word', 'Microsoft Excel'] },
  { label: 'Design & Digital Media', items: ['Visual Design', 'Web Design', 'UI Animation', 'DaVinci Resolve'] },
  { label: 'Programming & Technical', items: ['C++', 'Hardware Servicing', 'Networking'] },
]

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative z-10 mt-[50px] bg-cream shadow-[0px_16px_0px_0px_#f70] lg:mt-[56px] lg:shadow-[0px_20px_0px_0px_#f70]"
    >
      <div className="relative mx-auto min-h-[301.73px] max-w-[1440px] pt-[17px] pb-12 lg:min-h-[256.35px] lg:pt-4">
        <div className="lg:hidden">
          <Stars smallTop={28} className="top-0 left-[-5px]" />
          <VLine src={assets.skillsLineMobileLong} length={193} className="top-[78px] left-[32px]" />
          <VLine src={assets.skillsLineMobileShort} length={145} className="top-[96px] left-[49px]" />
        </div>
        <div className="hidden lg:block">
          <Stars smallTop={27} className="top-[9px] left-[37px]" />
          <VLine src={assets.skillsLineLong} length={137} className="top-[87px] left-[74px]" />
          <VLine src={assets.skillsLineShort} length={92} className="top-[98px] left-[91px]" />
        </div>

        <h2 id="skills-title" className="text-center font-gentle text-[32px] leading-[1.45] tracking-[-0.16px] text-black">
          Skills and Tools
        </h2>
        <div className="mx-auto mt-[29px] grid grid-cols-1 gap-x-10 gap-y-8 pr-5 pl-[65px] md:grid-cols-2 md:pr-10 md:pl-[100px] lg:mt-[34px] lg:grid-cols-4 lg:px-[140px]">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <h3 className="font-babel text-[14px] leading-[1.45] tracking-[2.8px] text-tangerine uppercase">{group.label}</h3>
              <ul className="flex flex-col gap-[5px]">
                {group.items.map((skill) => (
                  <li key={skill} className="font-babel text-[18px] leading-[1.45] tracking-[-0.09px] text-black">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
