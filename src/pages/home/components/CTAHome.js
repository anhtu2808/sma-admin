import React from 'react';

const CTA = () => {
    return (
        <section className="py-24 bg-primary text-white text-center px-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-heading font-extrabold mb-6">Ready to Transform Your Hiring?</h2>
                <p className="text-lg text-white/90 mb-10">Join thousands of companies and job seekers who have found their perfect match with RecruitAI.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-3 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-neutral-50 transition-colors">
                        Join as Candidate
                    </button>
                    <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                        Join as Recruiter
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
