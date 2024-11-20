import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';
import useModal from '../hooks/useModal';
import { logoutService } from '../services/auth/logoutService';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { IoPersonSharp } from 'react-icons/io5';
import logo from '../assets/logo.png';

const navigation = [
  { name: '회사소개', current: false },
  { name: '고객센터', current: false },
  { name: '자료실', current: false },
  { name: '로그인', current: false },
  { name: '마이페이지', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { openModal, closeModal, RenderModal } = useModal();

  const handleMouseEnter = (menu) => setIsMenuOpen(menu);
  const handleMouseLeave = () => setIsMenuOpen(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logoutService(apiUrl, {
        openModal,
        closeModal,
        navigateTo,
        routes,
      });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <header>
      <Disclosure
        as="nav"
        className={classNames(
          'fixed top-0 left-0 z-50 w-full h-16 bg-white transition-shadow',
          isScrolled ? 'shadow-md' : 'shadow-none'
        )}
      >
        <div className="px-2 mx-auto max-w-13xl sm:px-6 lg:px-24">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="relative inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md group hover:bg-white hover:text-black focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block w-6 h-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden w-6 h-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <div className="flex items-center flex-shrink-0 p-4">
                <img
                  alt="리앤생"
                  src={logo}
                  className="w-auto h-8"
                  onClick={() => navigateTo(routes.home)}
                />
              </div>
            </div>

            {/* Menu with hover effect */}
            <div className="relative flex items-center pr-2 right-0 sm:static sm:inset-auto sm:ml-6 sm:pr-0 sm:flex hidden">
              {/* 회사소개 */}
              <div
                className="relative py-3 ml-3"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo(routes.company)}
                  className="relative flex text-sm bg-transparent hover:border-2"
                >
                  <p className="text-gray4 font-bold">회사소개</p>
                </button>

                {isMenuOpen === 'about' && (
                  <div className="absolute z-20 w-32 py-1 mt-1 origin-top-center bg-white rounded-md shadow-lg left-1/2 transform -translate-x-1/2 ring-1 ring-black ring-opacity-5">
                    <a
                      onClick={() => navigateTo(routes.company)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      회사소개
                    </a>
                    <a
                      onClick={() => navigateTo(routes.history)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      연혁
                    </a>
                    <a
                      onClick={() => navigateTo(routes.location)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      오시는 길
                    </a>
                  </div>
                )}
              </div>

              {/* 고객센터 */}
              <div
                className="relative py-3 ml-3"
                onMouseEnter={() => handleMouseEnter('support')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo(routes.faq)}
                  className="relative flex text-sm bg-transparent hover:border-2"
                >
                  <span className="sr-only">Open support menu</span>
                  <p className="text-gray4 font-bold">고객센터</p>
                </button>

                {isMenuOpen === 'support' && (
                  <div className="absolute z-20 w-40 py-1 mt-1 origin-top-center bg-white rounded-md shadow-lg left-1/2 transform -translate-x-1/2 ring-1 ring-black ring-opacity-5">
                    <a
                      onClick={() => navigateTo(routes.faq)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      자주 묻는 질문
                    </a>
                    <a
                      onClick={() => navigateTo(routes.qna)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      1:1 문의
                    </a>
                  </div>
                )}
              </div>

              {/* 자료실 */}
              <div
                className="relative py-3 ml-3"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo(routes.certificate)}
                  className="relative flex text-sm bg-transparent hover:border-2"
                >
                  <span className="sr-only">Open resources menu</span>
                  <p className="text-gray4 font-bold">자료실</p>
                </button>

                {isMenuOpen === 'resources' && (
                  <div className="absolute z-20 w-32 py-1 mt-1 origin-top-center bg-white rounded-md shadow-lg left-1/2 transform -translate-x-1/2 ring-1 ring-black ring-opacity-5">
                    <a
                      onClick={() => navigateTo(routes.certificate)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      인증서
                    </a>
                    <a
                      onClick={() => navigateTo(routes.coa)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      성적서
                    </a>
                    <a
                      onClick={() => navigateTo(routes.press)}
                      className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                    >
                      보도자료
                    </a>
                  </div>
                )}
              </div>

              {/* 로그인 여부에 따라 */}
              {isLoggedIn ? (
                <div
                  className="relative py-3 ml-3"
                  onMouseEnter={() => handleMouseEnter('mypage')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    // onClick={() => navigateTo(routes.mypageMember)}
                    className="relative flex text-sm bg-transparent hover:border-2"
                  >
                    <IoPersonSharp className="text-gray4" />
                  </button>

                  {isMenuOpen === 'mypage' && (
                    <div className="absolute z-20 w-32 py-1 mt-1 origin-top-center bg-white rounded-md shadow-lg left-1/2 transform -translate-x-1/2 ring-1 ring-black ring-opacity-5">
                      <a className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary">
                        {localStorage.getItem('name')}님
                      </a>
                      <hr />
                      <a
                        onClick={() => navigateTo(routes.mypageMember)}
                        className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                      >
                        마이페이지
                      </a>
                      <a
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray4 hover:bg-placeHolder hover:text-primary"
                      >
                        로그아웃
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="relative ml-3"
                  onMouseEnter={() => handleMouseEnter('login')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => navigateTo(routes.signin)}
                    className="relative flex text-sm bg-transparent hover:border-2"
                  >
                    <span className="sr-only">Open login menu</span>
                    <p className="text-gray4 font-bold">로그인</p>
                  </button>
                </div>
              )}

              {/* 임시페이지(삭제 예정) */}
              {/* <div
                className="relative ml-3"
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigateTo(routes.tmp)}
                  className="relative flex text-sm bg-transparent hover:border-2"
                >
                  <p className="text-gray4 font-bold">임시</p>
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <DisclosurePanel className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-white text-black'
                    : 'text-black hover:bg-gray4 hover:text-primary',
                  'block px-3 py-2 text-base font-medium rounded-md'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
      <RenderModal />
    </header>
  );
}
