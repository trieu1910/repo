// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "sendpage",
        "name": "Motchill (Sendpage)",
        "version": "1.0.0",
        "baseUrl": "https://sendpage.org",
        "iconUrl": "https://sendpage.org/favicon.ico",
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'phim-le', title: 'Phim Lẻ', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-bo', title: 'Phim Bộ', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-chieu-rap', title: 'Phim Chiếu Rạp', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'hoat-hinh', title: 'Hoạt Hình', type: 'Horizontal', path: 'the-loai' },
        { slug: 'hanh-dong', title: 'Hành Động', type: 'Horizontal', path: 'the-loai' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim mới', slug: 'phim-moi' },
        { name: 'Phim lẻ', slug: 'danh-sach/phim-le' },
        { name: 'Phim bộ', slug: 'danh-sach/phim-bo' },
        { name: 'Hành động', slug: 'the-loai/hanh-dong' },
        { name: 'Chiếu rạp', slug: 'danh-sach/phim-chieu-rap' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({});
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        var path = filters.path || "";

        var baseUrl = "https://sendpage.org/";
        var finalUrl = baseUrl;

        // Xử lý các dạng path từ HomeSections
        if (path === "danh-sach") {
            finalUrl += "danh-sach/" + slug;
        } else if (path === "the-loai") {
            finalUrl += "the-loai/" + slug;
        } else if (slug.indexOf("/") > -1) {
            // Đã truyền full slug kiểu `the-loai/hanh-dong`
            finalUrl += slug;
        } else {
            // Mặc định fallback
            finalUrl += slug;
        }

        if (page > 1) {
            // Dựa trên phân tích, có khả năng phân trang là ?page= hoặc /page-
            // Tạm dùng query do phổ biến chuẩn NextJS (đôi khi không đổi router)
            finalUrl += "?page=" + page;
        }

        return finalUrl;
    } catch (e) {
        return "https://sendpage.org";
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    // Tạm cấu hình trang search
    return "https://sendpage.org/tim-kiem/" + encodeURIComponent(keyword) + "?page=" + page;
}

function getUrlDetail(slug) {
    return "https://sendpage.org/phim/" + slug;
}

function getUrlCategories() { return "https://sendpage.org/"; }
function getUrlCountries() { return "https://sendpage.org/"; }
function getUrlYears() { return "https://sendpage.org/"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var movies = [];
    var moviesMap = {};

    // Phân tích NextJS __next_f.push nếu nó được nhúng trong list dưới dạng json, 
    // hoặc quét các thẻ anchor `<a>` như code parse_home.js
    var itemRegex = /<a[^>]+href="\/phim\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    var match;

    while ((match = itemRegex.exec(html)) !== null) {
        var slug = match[1];
        var itemHtml = match[2];

        // Rút trích Title (alt hình ảnh thường là title)
        var titleMatch = itemHtml.match(/alt=["']([^"']+)["']/);
        var title = titleMatch ? titleMatch[1] : "";

        // Rút trích Image url (thường tìm `src="` hoặc `src=`)
        var thumbMatch = itemHtml.match(/src=["']([^"']+)["']/);
        var thumb = thumbMatch ? thumbMatch[1] : "";
        if (thumb.indexOf("http") !== 0 && thumb.length > 0) {
            thumb = "https://sendpage.org" + (thumb.startsWith("/") ? "" : "/") + thumb;
        }

        // Rút trích episode current (Tập 1, Tập 2...) nằm trong div/span
        // Đoạn html nhỏ nên match text là đủ
        var epMatch = itemHtml.match(/<span[^>]*>(Tập\s?\d+|<[^>]+>[^<]+|Full)[^<]*<\/span>/i);
        var episode = "";
        if (epMatch) {
            episode = epMatch[1].replace(/<[^>]*>/g, "").trim();
        }

        if (slug) {
            if (!moviesMap[slug]) {
                moviesMap[slug] = {
                    id: slug,
                    title: PluginUtils.cleanText(title) || "Loading...",
                    posterUrl: thumb,
                    backdropUrl: thumb,
                    year: 0,
                    quality: "HD",
                    episode_current: episode || "Full",
                    lang: "Vietsub"
                };
            }
        }
    }

    for (var key in moviesMap) {
        if (moviesMap.hasOwnProperty(key)) {
            movies.push(moviesMap[key]);
        }
    }

    return JSON.stringify({
        items: movies,
        pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: movies.length,
            itemsPerPage: 20
        }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

var PluginUtils = {
    cleanText: function (text) {
        if (!text) return "";
        return text.replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/\s+/g, " ")
            .trim();
    }
};

function parseMovieDetail(html) {
    try {
        var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        var thumbMatch = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/i);
        var thumb = thumbMatch ? thumbMatch[1] : "";
        if (thumb && thumb.indexOf("http") !== 0) {
            thumb = "https://sendpage.org" + (thumb.startsWith("/") ? "" : "/") + thumb;
        }

        var epsArr = [];
        var epRegex = /<a[^>]+href="([^"]*(?:\/phim\/)[^"]*tap-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
        var epMatch;
        var seenUrls = {};

        while ((epMatch = epRegex.exec(html)) !== null) {
            var epUrl = epMatch[1];
            var epName = PluginUtils.cleanText(epMatch[2]);
            if (!epName || epName === "" || epName.indexOf("<svg") > -1) {
                // Tách text từ link path
                var tMatch = epUrl.match(/tap-(\d+)/);
                epName = tMatch ? "Tập " + tMatch[1] : "Xem Ngay";
            }

            if (!seenUrls[epUrl]) {
                // Dùng original path
                epsArr.push({
                    id: epUrl, // pass cho param getUrlStream / parseDetailResponse
                    name: epName,
                    slug: epName
                });
                seenUrls[epUrl] = true;
            }
        }

        var servers = [];
        if (epsArr.length > 0) {
            servers.push({
                name: "Vietsub",
                episodes: epsArr
            });
        } else {
            servers.push({
                name: "Phim Lẻ",
                episodes: [{
                    id: "trailer", // placeholder nếu ko có
                    name: "Full",
                    slug: "full"
                }]
            });
        }

        return JSON.stringify({
            id: "", // VAAPP tự lo
            title: title || "Chưa có tiêu đề",
            posterUrl: thumb,
            backdropUrl: thumb,
            description: "",
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: 0,
            rating: 0,
            casts: "",
            director: "",
            country: "",
            category: "",
            status: "Hoàn tất"
        });
    } catch (e) {
        return "null";
    }
}

function parseDetailResponse(html, fallbackUrl) {
    try {
        var opstreamLink = "";

        var scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        var match;
        while ((match = scriptRegex.exec(html)) !== null) {
            var content = match[1];
            if (content.indexOf('opstream90') > -1 || content.indexOf('.m3u8') > -1) {
                var linkRegex = /https?:\/\/[^\s"'\\]+\.m3u8/gi;
                var links = content.match(linkRegex);
                if (links && links.length > 0) {
                    opstreamLink = links[0];
                    break;
                }
            }
        }

        if (opstreamLink) {
            return JSON.stringify({
                url: opstreamLink,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Origin": "https://sendpage.org",
                    "Referer": "https://sendpage.org"
                },
                subtitles: []
            });
        }

        // Tạm coi link hỏng
        return JSON.stringify({
            url: "",
            headers: {},
            subtitles: []
        });
    } catch (e) {
        return JSON.stringify({ url: "", headers: {}, subtitles: [] });
    }
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
