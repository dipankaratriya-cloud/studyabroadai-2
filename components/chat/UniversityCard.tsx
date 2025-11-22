'use client'

interface UniversityCardProps {
  name: string
  country: string
  ranking?: number
  tuition?: string
  acceptanceRate?: string
  logo?: string
  onCompare?: () => void
}

export function UniversityCard({
  name,
  country,
  ranking,
  tuition,
  acceptanceRate,
  logo,
  onCompare,
}: UniversityCardProps) {
  return (
    <div className="w-full p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          style={logo ? { backgroundImage: `url(${logo})` } : {}}
        >
          {!logo && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400">school</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {country} {ranking && `• Rank #${ranking}`}
          </p>
        </div>
        <button
          onClick={onCompare}
          className="flex items-center justify-center gap-2 h-9 px-3 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Compare</span>
        </button>
      </div>
      {(tuition || acceptanceRate) && (
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {tuition && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Tuition</p>
              <p className="font-semibold">{tuition}</p>
            </div>
          )}
          {acceptanceRate && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Acceptance Rate</p>
              <p className="font-semibold">{acceptanceRate}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
