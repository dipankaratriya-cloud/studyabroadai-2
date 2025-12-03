'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, GraduationCap, DollarSign, Globe, Calendar, Save, LogOut } from 'lucide-react';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  location: string;
}

interface StudentProfile {
  education_level?: string;
  field_of_interest?: string;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  preferred_countries?: string[];
  test_scores?: {
    ielts?: number;
    toefl?: number;
    gre?: number;
    sat?: number;
  };
  timeline?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setProfile({
      full_name: user.user_metadata?.full_name || '',
      email: user.email || '',
      phone: user.user_metadata?.phone || '',
      location: user.user_metadata?.location || ''
    });

    // Fetch latest student profile from chat sessions
    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('student_profile')
      .eq('user_id', user.id)
      .not('student_profile', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (sessions && sessions.length > 0 && sessions[0].student_profile) {
      setStudentProfile(sessions[0].student_profile);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        phone: profile.phone,
        location: profile.location
      }
    });

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      alert('Profile saved successfully!');
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Profile & Settings</h1>

      {/* Personal Information */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block flex items-center gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Your full name"
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                Email
              </label>
              <Input
                type="email"
                value={profile.email}
                disabled
                className="bg-muted h-10 sm:h-11 text-sm sm:text-base"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                Phone Number
              </label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block flex items-center gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                Location
              </label>
              <Input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Mumbai, India"
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="h-9 sm:h-10 text-sm sm:text-base">
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            Study Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentProfile ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {studentProfile.education_level && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Education:</span>
                    <Badge variant="secondary" className="text-xs">{studentProfile.education_level}</Badge>
                  </div>
                )}
                {studentProfile.field_of_interest && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Field:</span>
                    <Badge variant="secondary" className="text-xs">{studentProfile.field_of_interest}</Badge>
                  </div>
                )}
                {(studentProfile.budget_min || studentProfile.budget_max) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Budget:</span>
                    <Badge variant="secondary" className="text-xs">
                      {studentProfile.budget_currency || 'USD'} {studentProfile.budget_min?.toLocaleString()} - {studentProfile.budget_max?.toLocaleString()}
                    </Badge>
                  </div>
                )}
                {studentProfile.timeline && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Timeline:</span>
                    <Badge variant="secondary" className="text-xs">{studentProfile.timeline}</Badge>
                  </div>
                )}
              </div>

              {studentProfile.preferred_countries && studentProfile.preferred_countries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Preferred Countries:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {studentProfile.preferred_countries.map((country, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{country}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {studentProfile.test_scores && Object.keys(studentProfile.test_scores).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Test Scores:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {studentProfile.test_scores.ielts && (
                      <Badge variant="outline" className="text-xs">IELTS: {studentProfile.test_scores.ielts}</Badge>
                    )}
                    {studentProfile.test_scores.toefl && (
                      <Badge variant="outline" className="text-xs">TOEFL: {studentProfile.test_scores.toefl}</Badge>
                    )}
                    {studentProfile.test_scores.gre && (
                      <Badge variant="outline" className="text-xs">GRE: {studentProfile.test_scores.gre}</Badge>
                    )}
                    {studentProfile.test_scores.sat && (
                      <Badge variant="outline" className="text-xs">SAT: {studentProfile.test_scores.sat}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-primary/5 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Your study preferences will be automatically extracted from your conversations
                with the AI advisor.
              </p>
              <p className="text-xs sm:text-sm flex items-center gap-2">
                <span className="text-base sm:text-lg">💡</span>
                <strong>Tip:</strong> Start a conversation to build your personalized student profile!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2">
              <div>
                <p className="text-sm sm:text-base font-medium">Sign Out</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="h-9 sm:h-10 text-sm w-full sm:w-auto">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2 border-t pt-3 sm:pt-4">
              <div>
                <p className="text-sm sm:text-base font-medium text-destructive">Delete Account</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" className="h-9 sm:h-10 text-sm w-full sm:w-auto">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
