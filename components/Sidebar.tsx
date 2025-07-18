'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type SidebarProps = {
  role?: string;
};

const studentNav = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Assignments', href: '/dashboard/assignments', icon: BookOpenIcon },
  { name: 'Grades', href: '/dashboard/grades', icon: ClipboardDocumentCheckIcon },
  { name: 'Attendance', href: '/dashboard/attendance', icon: UserGroupIcon },
];

const teacherNav = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Students', href: '/dashboard/students', icon: UserGroupIcon },
  { name: 'Assignments', href: '/dashboard/assignments', icon: BookOpenIcon },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClipboardDocumentCheckIcon },
  { name: 'Announcements', href: '/dashboard/announcements', icon: BellIcon },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navigation = role === 'TEACHER' ? teacherNav : studentNav;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold">Smart Campus</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div>
                <UserIcon className="h-10 w-10 rounded-full text-indigo-300" />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">
                  {role === 'TEACHER' ? 'Teacher' : 'Student'} Account
                </p>
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium text-indigo-200 group-hover:text-white"
                >
                  View settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
