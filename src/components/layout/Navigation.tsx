"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = Navigation;
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../contexts/AuthContext");
const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Health Tracking', href: '/health' },
    { name: 'Settings', href: '/settings' },
];
function Navigation() {
    const { user, signOut } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    return (<react_2.Disclosure as="nav" className="bg-primary-dark">
      {({ open }) => {
            let _a, _b;
            return (<>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <span className="text-white text-xl font-bold">Golden Years</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (<react_router_dom_1.Link key={item.name} to={item.href} className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === item.href
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-200 hover:text-white'}`}>
                      {item.name}
                    </react_router_dom_1.Link>))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <react_2.Menu as="div" className="relative ml-3">
                  <react_2.Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                      {(_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a[0].toUpperCase()}
                    </div>
                  </react_2.Menu.Button>
                  <react_2.Transition as={react_1.Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <react_2.Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <react_2.Menu.Item>
                        {({ active }) => (<button onClick={signOut} className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left`}>
                            Sign out
                          </button>)}
                      </react_2.Menu.Item>
                    </react_2.Menu.Items>
                  </react_2.Transition>
                </react_2.Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <react_2.Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-primary-light hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (<outline_1.XMarkIcon className="block h-6 w-6" aria-hidden="true"/>) : (<outline_1.Bars3Icon className="block h-6 w-6" aria-hidden="true"/>)}
                </react_2.Disclosure.Button>
              </div>
            </div>
          </div>

          <react_2.Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (<react_router_dom_1.Link key={item.name} to={item.href} className={`block py-2 pl-3 pr-4 text-base font-medium ${location.pathname === item.href
                        ? 'bg-primary-light text-white'
                        : 'text-gray-200 hover:bg-primary-light hover:text-white'}`}>
                  {item.name}
                </react_router_dom_1.Link>))}
            </div>
            <div className="border-t border-primary-light pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                    {(_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b[0].toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user === null || user === void 0 ? void 0 : user.name}</div>
                  <div className="text-sm font-medium text-gray-200">{user === null || user === void 0 ? void 0 : user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button onClick={signOut} className="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-primary-light hover:text-white w-full text-left">
                  Sign out
                </button>
              </div>
            </div>
          </react_2.Disclosure.Panel>
        </>);
        }}
    </react_2.Disclosure>);
}
