const assetPathPrefix = '/assets'

export const assets = {
  pattern: `${assetPathPrefix}/34c43.png`,
  portrait: `${assetPathPrefix}/a013d.png`,
  star: `${assetPathPrefix}/93e38.png`,
  figma: `${assetPathPrefix}/7a416.png`,
  github: `${assetPathPrefix}/github.svg`,
  linkedin: `${assetPathPrefix}/1b194.png`,
  call: `${assetPathPrefix}/47868.svg`,
  email: `${assetPathPrefix}/4e762.svg`,
  arrowOrange: `${assetPathPrefix}/ced73.svg`,
  arrowWhite: `${assetPathPrefix}/821ae.svg`,
  verifiedOrange: `${assetPathPrefix}/78ae7.svg`,
  verifiedEmpty: `${assetPathPrefix}/3dfc5.svg`,
  verifiedWhite: `${assetPathPrefix}/ee1c4.svg`,
  footerGithub: `${assetPathPrefix}/footer-github.svg`,
  footerFigma: `${assetPathPrefix}/footer-figma.svg`,
  footerLinkedin: `${assetPathPrefix}/a50f1.svg`,
  // Desktop lines
  heroLine: `${assetPathPrefix}/2b4b2.svg`,
  aboutLineLong: `${assetPathPrefix}/05c31.svg`,
  aboutLineShort: `${assetPathPrefix}/217cf.svg`,
  skillsLineLong: `${assetPathPrefix}/240c3.svg`,
  skillsLineShort: `${assetPathPrefix}/e7999.svg`,
  // Mobile lines
  heroLineMobile: `${assetPathPrefix}/dc618.svg`,
  // Project screenshots (public/assets/projects)
  projectCitracker: `${assetPathPrefix}/projects/citracker.jpg`,
  projectShallowSleepRoom: `${assetPathPrefix}/projects/shallow-sleep-room.jpg`,
  projectShallowSleepLobby: `${assetPathPrefix}/projects/shallow-sleep-lobby.jpg`,
  projectShallowSleepDoctor: `${assetPathPrefix}/projects/shallow-sleep-doctor.jpg`,
  projectShallowSleepDoll: `${assetPathPrefix}/projects/shallow-sleep-doll.jpg`,
  projectPortfolio: `${assetPathPrefix}/projects/portfolio.jpg`,
  aboutLineMobileA: `${assetPathPrefix}/c4679.svg`,
  aboutLineMobileH: `${assetPathPrefix}/f2e7c.svg`,
  aboutLineMobileB: `${assetPathPrefix}/c2414.svg`,
  skillsLineMobileLong: `${assetPathPrefix}/b997c.svg`,
  skillsLineMobileShort: `${assetPathPrefix}/8941e.svg`,
}

/**
 * Every outbound link on the site lives here. Values of '#' are placeholders
 * waiting for a real URL; clicks on them are ignored (see App.tsx).
 */
export const links = {
  linkedin: 'https://www.linkedin.com/in/andrei-acosta-276a3241b/',
  figma: 'https://www.figma.com/@andreiacosta1',
  github: 'https://github.com/phyacinth',
  phone: 'tel:+639288986970',
  email: 'mailto:atsocaandrei185@gmail.com',
  cvFile: '/Andrei-Acosta-CV.pdf',
  projects: {
    /** CiTracker has no public link yet ("coming soon"). */
    shallowSleepAssets: 'https://drive.google.com/drive/folders/1mvJR6dOOgHnJ3UJOoRgQDX3htYbS5que?usp=sharing',
    portfolioSource: 'https://github.com/phyacinth/ojt_portfolio_deliverables',
  },
  certificates: {
    cpp: 'https://www.sololearn.com/certificates/CC-IFWLSTNZ',
    sql: 'https://bulsumain.sharepoint.com/sites/CT3023CG11stSemS.Y.2025-2026/Student%20Work/Working%20files/Andrei%20M.%20Acosta/FINAL%20PROJECT/lsql-cert-E7423B-11-2025.pdf',
  },
  /** Links used by the old "My Works" rows, kept for when the project buttons get real URLs. */
  previous: {
    inventoryPrototype:
      'https://www.figma.com/proto/b6q0jETsBfMK0U1Pf94TgQ/Group2-Final-IID1-3CG1--CIT-LABORATORY-SYSTEM?node-id=7-409&page-id=0%3A1&starting-point-node-id=7%3A409&t=mGReESxHVcTYlKqV-1',
    thesisDoc: 'https://sharetext.io/nr8ttv7s',
  },
}

/** Opens real external URLs in a new tab; placeholders and mailto/tel stay in place. */
export function externalProps(href: string) {
  return href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}
}
