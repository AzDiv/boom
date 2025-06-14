import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ChevronRight, 
  Users, 
  TrendingUp, 
  Shield, 
  Award
} from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-card rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">Boom Bag</span>
          </div>
          <div className="space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-secondary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-card text-primary rounded-md hover:bg-primary-light hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 mb-10 lg:mb-0"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Progress Together, Earn Together
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-secondary-light">
                Join Boom Bag and be part of a thriving community where your network becomes your net worth.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="btn bg-card text-primary hover:bg-primary-light hover:text-white flex items-center justify-center"
                >
                  Get Started
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
                <Link
                  to="/login"
                  className="btn border border-card text-white hover:bg-white/10 flex items-center justify-center"
                >
                  Login to Account
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-1/2 flex justify-center"
            >
              <div className="w-full max-w-md bg-card/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Group System</h3>
                    <p className="text-secondary-light">Create and grow your network</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card/20 rounded-lg p-4 flex items-center">
                    <Award className="h-5 w-5 text-secondary mr-3" />
                    <div>
                      <h4 className="font-medium">Level Progression</h4>
                      <p className="text-sm text-secondary-light">Advance through levels by growing your group</p>
                    </div>
                  </div>
                  <div className="bg-card/20 rounded-lg p-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-primary-light mr-3" />
                    <div>
                      <h4 className="font-medium">Verified Members</h4>
                      <p className="text-sm text-secondary-light">Unlock new levels with each verified member</p>
                    </div>
                  </div>
                  <div className="bg-card/20 rounded-lg p-4 flex items-center">
                    <Shield className="h-5 w-5 text-primary-dark mr-3" />
                    <div>
                      <h4 className="font-medium">Secure System</h4>
                      <p className="text-sm text-secondary-light">Safe, transparent progression system</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">How Boom Bag Works</h2>
            <p className="mt-4 text-xl text-text-secondary max-w-2xl mx-auto">
              A simple process to grow your network and progress through levels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Create Your Group',
                description: 'Once verified, you become a group owner and can invite others to join.',
                color: 'bg-primary-light text-primary-dark'
              },
              {
                icon: Shield,
                title: 'Verification Process',
                description: 'Members select a plan and get verified by our admin team.',
                color: 'bg-secondary-light text-secondary-dark'
              },
              {
                icon: TrendingUp,
                title: 'Level Progression',
                description: 'Every 4 verified members helps you advance to the next level.',
                color: 'bg-primary/20 text-primary-dark'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl shadow-sm p-6"
              >
                <div className={`p-3 rounded-lg ${feature.color} inline-block`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-primary">{feature.title}</h3>
                <p className="mt-2 text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Choose Your Plan</h2>
            <p className="mt-4 text-xl text-text-secondary max-w-2xl mx-auto">
              Select the plan that fits your goals and ambitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter Plan',
                price: '$5',
                features: [
                  'Access to Levels 10, 20, 30',
                  'Standard progression speed',
                  'Basic invitation tools',
                  'Community support'
                ],
                color: 'border-primary',
                buttonColor: 'bg-primary hover:bg-primary-dark',
                badge: null
              },
              {
                name: 'Gold Plan',
                price: '$50',
                popular: true,
                features: [
                  'Access to Levels 10-60',
                  'Faster progression rates',
                  'Advanced group tools',
                  'Priority support'
                ],
                color: 'border-secondary',
                buttonColor: 'bg-secondary hover:bg-secondary-dark',
                badge: (
                  <span className="inline-block bg-secondary text-white px-3 py-1 rounded-b-lg text-xs font-semibold tracking-wide shadow">
                    MOST POPULAR
                  </span>
                )
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-card rounded-xl shadow-md overflow-hidden border-2 ${plan.color} relative`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    {plan.badge}
                  </div>
                )}
                <div className="p-6 pt-10">
                  <h3 className="text-2xl font-bold text-primary">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold text-text-primary">{plan.price}</span>
                    <span className="ml-1 text-xl font-medium text-text-secondary">one-time</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-primary-light text-primary-dark">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="ml-3 text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      to="/register"
                      className={`block w-full text-center py-3 rounded-md font-medium text-white ${plan.buttonColor} shadow-lg transition-colors`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="p-2 bg-card rounded-lg">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <span className="ml-2 text-xl font-bold">Boom Bag</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-secondary-light hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-secondary-light hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/faq" className="text-secondary-light hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-secondary-light text-sm">
            &copy; {new Date().getFullYear()} Boom Bag. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export default Landing;