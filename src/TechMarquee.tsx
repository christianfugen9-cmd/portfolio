import type { IconType } from 'react-icons'
import { FaAws } from 'react-icons/fa'
import {
  SiApachekafka,
  SiDocker,
  SiElasticsearch,
  SiGithubactions,
  SiGo,
  SiGrafana,
  SiGraphql,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiNginx,
  SiNodedotjs,
  SiOpentelemetry,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiRabbitmq,
  SiRedis,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import './TechMarquee.css'

const GrpcIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4" />
  </svg>
)

const technologies: { name: string; Icon?: IconType }[] = [
  { name: 'Go', Icon: SiGo },
  { name: 'Python', Icon: SiPython },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'Redis', Icon: SiRedis },
  { name: 'Kafka', Icon: SiApachekafka },
  { name: 'Kubernetes', Icon: SiKubernetes },
  { name: 'Docker', Icon: SiDocker },
  { name: 'gRPC', Icon: GrpcIcon },
  { name: 'RabbitMQ', Icon: SiRabbitmq },
  { name: 'Terraform', Icon: SiTerraform },
  { name: 'AWS', Icon: FaAws },
  { name: 'Prometheus', Icon: SiPrometheus },
  { name: 'Grafana', Icon: SiGrafana },
  { name: 'Nginx', Icon: SiNginx },
  { name: 'GraphQL', Icon: SiGraphql },
  { name: 'MongoDB', Icon: SiMongodb },
  { name: 'Elasticsearch', Icon: SiElasticsearch },
  { name: 'Linux', Icon: SiLinux },
  { name: 'GitHub Actions', Icon: SiGithubactions },
  { name: 'OpenTelemetry', Icon: SiOpentelemetry },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'Node.js', Icon: SiNodedotjs },
]

export function TechMarquee() {
  return (
    <section className="tech-marquee" aria-label="Core technology stack">
      <span className="tech-marquee__label">Core stack</span>
      <div className="tech-marquee__viewport" tabIndex={0}>
        <div className="tech-marquee__track">
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className="tech-marquee__list"
              role="list"
              aria-hidden={duplicate || undefined}
            >
              {technologies.map(({ name, Icon }) => (
                <li key={name} className="tech-marquee__item">
                  {Icon && <Icon className="tech-marquee__icon" aria-hidden="true" focusable="false" />}
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
