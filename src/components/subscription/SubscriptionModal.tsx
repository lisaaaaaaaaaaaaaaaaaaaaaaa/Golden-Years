"use strict";
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModal = SubscriptionModal;
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const AuthContext_1 = require("../../contexts/AuthContext");
const stripe_1 = require("../../services/stripe");
function SubscriptionModal({ isOpen, onClose }) {
    const { user } = (0, AuthContext_1.useAuth)();
    const handleSubscribe = () => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            yield (0, stripe_1.createSubscription)(user.id);
            onClose();
        }
        catch (error) {
            console.error('Error creating subscription:', error);
        }
    });
    return (<react_2.Transition appear show={isOpen} as={react_1.Fragment}>
      <react_2.Dialog as="div" className="relative z-50" onClose={onClose}>
        <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
        </react_2.Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <react_2.Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <react_2.Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Upgrade to Premium
                </react_2.Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Get access to all premium features for just $10/month:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      Unlimited pet profiles
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      Advanced health tracking
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      Custom reminders
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2" onClick={handleSubscribe}>
                    Subscribe Now
                  </button>
                  <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </react_2.Dialog.Panel>
            </react_2.Transition.Child>
          </div>
        </div>
      </react_2.Dialog>
    </react_2.Transition>);
}
