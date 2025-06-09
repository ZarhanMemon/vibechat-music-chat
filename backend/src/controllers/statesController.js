import Album from "../modules/albumModel.js";
import Songs from "../modules/songsModel.js";
import User from "../modules/userModel.js";

export const getStates = async (req, res, next) => {
    try {

        // const totalSongs = await Songs.countDocuments()
        // const totalUsers = await User.countDocuments() 
        // const totalAlbums = await Album.countDocuments()   or


        const [totalSongs, totalUsers, totalAlbums, artistCountResult] = await Promise.all([
            Songs.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),


            //$unionWith: Merges documents from the albums collection into the pipeline from all the Songs
            //$group: Groups documents by artist.
            //$count: Counts the number of distinct artists.
            Songs.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    }
                },
                {
                    $group: {
                        _id: "$artist"
                    }
                },
                {
                    $count: "count"
                }
            ])
        ]);

        const totalArtist = artistCountResult[0]?.count || 0;

        res.status(200).json({
            totalSongs,
            totalUsers,
            totalAlbums,
            totalArtist
        });
    } catch (error) {
        next(error);
    }
};
