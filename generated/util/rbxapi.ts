// rbxapi.ts
// module containing wrapper functions for dealing with the roblox api
// @kalrnlo
// 27/03/2024
type avatar_headshot_sizes = "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x110" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720";
type avatar_body_sizes = "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x110" | "140x140" | "150x150" | "150x200" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720";
type avatar_bust_sizes = "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "150x150" | "180x180" | "352x352" | "420x420";
type avatar_thumbnail_size = avatar_headshot_sizes | avatar_body_sizes | avatar_bust_sizes;
type avatar_thumbnail_type = "avatar" | "avatar-bust" | "avatar-headshot";
type PlayerThumbnailData = {
    imageUrl: string;
    targetId: number;
    state: string;
};
type thumbnail_opts = {
    format: "png" | "jpeg";
    is_circular: boolean;
    max_retrys: number;
};
type membership_info = {
    user_id: number;
    rank: number;
};
type message_result = {
    status_text: string;
    status: number;
    ok: false;
} | {
    status_text: string;
    status: 200;
    ok: true;
};
type message_info = {
    messaging_service_key: string;
    universe_id: number;
};
type servers = {
    current_players: number;
    max_players: number;
    job_id: string;
}[];
const base_messaging_url = "https://apis.roblox.com/messaging-service/v1/universes/";
const base_thumbnail_url = "https://thumbnails.roblox.com/v1/users/";
const base_groups_url = "https://apis.roblox.com/cloud/v2/groups/";
const base_games_url = "https://games.roblox.com/v1/games/";
function timeout(ms: number): Promise<null> {
    return new Promise(resolve => { setTimeout(resolve, ms); });
}
export class config {
    static retry_delay = 500;
    static group_key = "";
    static group_id = 0;
}
export async function get_place_servers(place_id: number, max_servers_to_fetch: 10 | 25 | 50 | 100 = 25): Promise<servers> {
    const responce = await fetch(base_games_url + `${place_id}/servers/0?limit=${max_servers_to_fetch}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responce.status == 200) {
        const servers = new Array(max_servers_to_fetch) as servers;
        const json: any = await responce.json();
        let index = 0;
        for (const server_data in json) {
            servers[index] = {
                current_players: (server_data as any).playing,
                max_players: (server_data as any).maxPlayers,
                job_id: (server_data as any).id,
            };
            index++;
        }
        return Promise.resolve(servers);
    }
    else {
        throw new Error(responce.statusText);
    }
}
/**
 * This function sends the provided message to all subscribers to the topic,
 * triggering their registered callbacks to be invoked.
 * Modified from: https://github.com/Daw588/roblox.js/blob/main/src/api/luau/universe.ts
 *
 * Same as MessagingService:PublishAsync()
 * @param topic Determines where the message is sent.
 * @param message The data to include in the message.
 * @returns message_result
 */
export async function publish_message(topic: string, message: string, info: message_info): Promise<message_result> {
    if (message.length > 1024) {
        throw new Error("Message cannot be longer than 1024 characters");
    }
    else if (topic.length > 80) {
        throw new Error("Topic cannot be longer than 80 characters");
    }
    const response = await fetch(base_messaging_url + `${info.universe_id}/topics/${topic}`, {
        headers: {
            "x-api-key": info.messaging_service_key,
            "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
            message: message
        })
    });
    if (response.status === 200) {
        // If successful, it will return empty response body
        const body = await response.text();
        if (body.length === 0) {
            return Promise.resolve({
                status_text: response.statusText,
                status: response.status,
                ok: true,
            });
        }
    }
    return Promise.reject({
        status_text: response.statusText,
        status: response.status,
        ok: false,
    });
}
/**
 * Gets thumbnails for the provided userids
 *
 * Modified from: https://github.com/noblox/noblox.js/blob/master/lib/thumbnails/getPlayerThumbnail.js
 */
export async function get_thumbnails(type: avatar_thumbnail_type, size: avatar_thumbnail_size, user_ids: number[], opts: thumbnail_opts = {
    is_circular: false,
    max_retrys: 2,
    format: "jpeg",
}): Promise<PlayerThumbnailData[]> {
    if (user_ids.length > 100) {
        throw new Error("Cannot get more than 100 thumbnails at a time");
    }
    const url = base_thumbnail_url + `${type}?userIds=${user_ids.join(",")}&size=${size}&format=${opts.format}&isCircular=${opts.is_circular}`;
    const responce = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responce.status === 200) {
        let data = await responce.json();
        if (opts.max_retrys > 0) {
            // Get 'Pending' thumbnails as array of userIds
            const pending_thumbnails = data.filter(obj => { return obj.state === 'Pending'; }).map(obj => obj.targetId);
            if (pending_thumbnails.length > 0) {
                // small delay helps cache populate on Roblox's end; default 500ms
                await timeout(config.retry_delay);
                --opts.max_retrys;
                // Recursively retry for # of maxRetries attempts; default 2
                const updated_pending = await get_thumbnails(type, size, pending_thumbnails, opts);
                // Update primary array's values
                data = data.map(obj => updated_pending.find(o => o.targetId === obj.targetId) || obj);
            }
        }
        data = data.map(obj => {
            if (obj.state !== 'Completed') {
                obj.imageUrl = `https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_${size}.png`;
            }
            return obj;
        });
        return Promise.resolve(data);
    }
    else if (responce.status === 400) {
        throw new Error(`Error Code ${responce.status}: ${responce.statusText}, type: ${type}, user_ids: ${user_ids.join(',')}, size: ${size}, is_circular: ${opts.is_circular}`);
    }
    else {
        throw new Error(`An unknown error occurred with get_thumbnail(), type: ${type}, user_ids: ${user_ids.join(',')}, size: ${size}, is_circular: ${opts.is_circular}`);
    }
}
/**
// for if this ever needs to be reimplemented
export class rbxapi {
    static config = {
        messaging_service_key = "",
        retry_delay = 500,
        universe_id = 0,
        group_key = "",
    }

    // ive sinned
    static get_membership_info_for_users(group: number, userids: Array<number>, maxpagesize: number?, pagetoken: string?): Promise<{membership_info: membership_info[], next_page_token: string}> {
        const rank_sub_start_index = group.toString().length + 13
        let filter: string

        if (userids.length > 1) {
            filter = `filter="user in [`
    
            userids.forEach(function(value, index) {
                if (index !== userids.length - 1) {
                    this += `'users/${value}', `
                } else {
                    this += `'users/${value}']"`
                }
            }, filter)
        } else if (userids.length === 1) {
            filter = `filter="user == 'users/${userids[0] || 0}'" `
        } else {
            return Promise.reject("userids array was left empty")
        }

        let requesturl = base_url + `cloud/v2/groups/${group}/memberships?maxPageSize=${maxpagesize || 10}&filter=${filter}`

        if (pagetoken !== null) {
            requesturl + `&pageToken=${pagetoken}`
        }
        let membership_info_array = new Array(userids.length)
        let next_page_token

        fetch(requesturl, { headers = new Headers("x-api-key", this.config.group_key) }).then(function(responce) {
            // fix to handle roblox error codes
            responce.json().then(function(jsonobj) {
                next_page_token = jsonobj.nextPageToken
                let index = 0

                for ([key, value] in Object.entries(jsonobj.groupMemberships)) {
                    membership_info_array[index] = {
                        rank = Number((value.role as string).substring(rank_sub_start_index)).valueOf(),
                        user_id = Number((value.user as string).substring(6)).valueOf(),
                    }
                    
                    index++
                }
            }, (reason) => {console.error(reason)})
        }, (reason) => {console.error(reason)})

        return nextpagetoken !== null ? Promise.resolve({
            membership_info = membership_info_array,
            next_page_token = next_page_token,
        }) : Promise.reject()
    }
}
 */ 
