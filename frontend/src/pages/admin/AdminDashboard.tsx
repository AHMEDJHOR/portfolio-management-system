import { Link } from 'react-router-dom'
import { useResourceList } from '../../hooks/useResourceList'
import { ADMIN_RESOURCES, type ResourceConfig } from './resources'

function CountCard({ config }: { config: ResourceConfig }) {
  const { data, isError } = useResourceList(config)
  const count = isError ? '–' : (data?.length ?? '…')

  return (
    <li>
      <Link to={config.path} className="pf-card pf-card--link">
        <span className="pf-label">{config.title}</span>
        <span className="admin-count">{count}</span>
      </Link>
    </li>
  )
}

export function AdminDashboard() {

  return (
    <div>
      <header className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
      </header>
      <ul className="pf-grid admin-counts">
        {ADMIN_RESOURCES.map((config) => (
          <CountCard key={config.key} config={config} />
        ))}
      </ul>
    </div>
  )
}