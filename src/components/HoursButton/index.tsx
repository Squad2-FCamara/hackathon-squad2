import { useState } from "react";
import { ToggleButton } from "react-bootstrap";
import { useQuery } from "react-query";
import api from "../../services/api";
import { formatHour } from "../../utils/formatHour";
import styles from "./styles.module.scss";

export type AvailabilityProfile = {
    user: {
        name: string,
        id: number,
        email: string,
        Profile: Profile
    }
}

export type Profile = {
    ProfileAvailability: [
        {
            availability: {
                id: number,
                day: Date,
                start_time: Date,
                end_time: Date
            }
        }
    ]
}

// hours button vai ser usado só no friendprofile
export function HoursButton() {
    const { data } = useQuery<AvailabilityProfile>('availabilitiesFriends', async () => {
        const response = await api.get('/user/availability/1')
        return response.data;
    }, {
        staleTime: 1000 * 60, //cache 1 minute
    })

    const [radioValue, setRadioValue] = useState(0);

    return (
        <>
            {data?.user.Profile.ProfileAvailability.map((item, idx) => {
                let startTime = formatHour(item.availability.start_time);
                let endTime = formatHour(item.availability.end_time);

                return (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={'outline-dark'}
                        checked={radioValue === item.availability.id}
                        value={item.availability.id}
                        onChange={(e) => setRadioValue(Number(e.currentTarget.value))}
                        className={styles.availabilityButton}
                    >
                        {`${startTime} - ${endTime}`}
                    </ToggleButton>
                )
            })}
        </>
    );
}