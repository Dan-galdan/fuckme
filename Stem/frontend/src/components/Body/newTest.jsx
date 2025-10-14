import { useState } from 'react';
import { Link } from 'react-router-dom';

function newTest(props) {
  return (
    <div className="w-full grid grid-cols-1 gap-6">
            <div key={props.id} className="p-6 rounded text-black shadow-lg bg-gradient-to-bl from-[#797979] via-[#d6d6d6] via-70% to-[#cecece]">
                <h3 className="text-xl font-bold mb-2">{props.title}</h3>
                <p className="text-md mb-4">{props.description}</p>
                <Link
                    to={props.path}
                    className="hover:underline text-sm font-thin"
                >
                    Цааш үзэх
                </Link>
            </div>
    </div>
  )
}

export default newTest;
