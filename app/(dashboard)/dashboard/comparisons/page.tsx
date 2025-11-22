import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

export default async function ComparisonsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: comparisons } = await supabase
    .from('saved_comparisons')
    .select('*')
    .eq('user_id', user?.id || '')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold">My Comparisons</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your saved university and country comparisons
        </p>
      </div>

      {comparisons && comparisons.length > 0 ? (
        <div className="grid gap-4">
          <p className="text-gray-600">You have {comparisons.length} saved comparison(s)</p>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No comparisons saved yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Start a chat with our AI advisor to compare universities and countries.
              You can save comparisons for later reference.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
