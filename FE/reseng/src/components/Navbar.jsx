import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: '회사소개', href: '#', current: false },
  { name: '고객센터', href: '#', current: false },
  { name: '자료실', href: '#', current: false },
  { name: '로그인', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  const handleMouseEnter = (menu) => setIsMenuOpen(menu);
  const handleMouseLeave = () => setIsMenuOpen(null);

  const navigate = useNavigate();

  const handleMain = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/signin'); // /login 페이지로 이동
  };

  return (
    <header>
      <Disclosure
        as="nav"
        className="bg-white fixed top-0 left-0 w-full z-50 h-16"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  alt="리앤생"
                  src={logo}
                  className="h-8 w-auto"
                  onClick={handleMain}
                />
              </div>
            </div>

            {/* Menu with hover effect */}
            <div className="relative right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 sm:flex hidden">
              {/* 회사소개 */}
              <div
                className="relative ml-3 py-3"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="relative flex text-sm focus:outline-none hover:border-2 bg-transparent">
                  <span className="sr-only">Open about menu</span>
                  <p>회사소개</p>
                </button>

                {isMenuOpen === 'about' && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-1 w-32 origin-top-center rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      회사소개
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      연혁
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      오시는 길
                    </a>
                  </div>
                )}
              </div>

              {/* 고객센터 */}
              <div
                className="relative ml-3 py-3"
                onMouseEnter={() => handleMouseEnter('support')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="relative flex text-sm focus:outline-none hover:border-2 bg-transparent">
                  <span className="sr-only">Open support menu</span>
                  <p>고객센터</p>
                </button>

                {isMenuOpen === 'support' && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-1 w-40 origin-top-center rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      자주 묻는 질문
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      1:1 문의
                    </a>
                  </div>
                )}
              </div>

              {/* 자료실 */}
              <div
                className="relative ml-3 py-3"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="relative flex text-sm focus:outline-none hover:border-2 bg-transparent">
                  <span className="sr-only">Open resources menu</span>
                  <p>자료실</p>
                </button>

                {isMenuOpen === 'resources' && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 mt-1 w-32 origin-top-center rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      인증서
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      성적서
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2EA642] hover:bg-gray-100"
                    >
                      보도자료
                    </a>
                  </div>
                )}
              </div>

              {/* 로그인 */}
              <div
                className="relative ml-3"
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={handleLogin}
                  className="relative flex text-sm focus:outline-none hover:border-2 bg-transparent"
                >
                  <span className="sr-only">Open login menu</span>
                  <p>로그인</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-white text-black'
                    : 'text-black hover:bg-gray-100 hover:text-[#2EA642]',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>
  );
}
