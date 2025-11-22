import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
        Profile & Settings
      </h1>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input
                type="text"
                defaultValue={user?.user_metadata?.full_name || ''}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                defaultValue={user?.email || ''}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                type="text"
                placeholder="Mumbai, India"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Study Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your study preferences will be automatically extracted from your conversations
            with the AI advisor. You can view and update them here once you start chatting.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Start a conversation to build your personalized student profile!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            <div className="flex justify-between items-center py-2 border-t pt-3">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
