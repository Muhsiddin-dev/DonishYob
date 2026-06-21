import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { EffectCube, Pagination } from 'swiper/modules';
import { BookOpen } from 'lucide-react';

interface SwipperBookImgProps {
    images: { imageUrl: string }[] | undefined;
    title: string;
}

export default function SwipperBookImg({ images, title }: SwipperBookImgProps) {

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary-400 mb-2" />
                <span className="text-xs text-gray-400 text-center px-2">Нет обложки</span>
            </div>
        );
    }
    

    return (
        <>
            <Swiper
                effect={'cube'}
                grabCursor={true}
                cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                pagination={true}
                modules={[EffectCube, Pagination]}
                className="mySwiper w-full h-full"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index} className="w-full p-0 m-0 rounded-sm z-0 h-full">
                        <img
                            src={img.imageUrl}
                            alt={title}
                            className="w-full h-full  object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

