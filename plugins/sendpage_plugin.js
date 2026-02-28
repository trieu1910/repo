// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "sendpage",
        "name": "Motchill (Sendpage)",
        "version": "1.0.0",
        "baseUrl": "https://motchillz.cx",
        "iconUrl": "https://motchillz.cx/favicon.ico",
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'motchill-de-cu', title: 'MOTCHILL ĐỀ CỬ', type: 'Horizontal', path: '' }, // Using path='' means home page regex
        { slug: 'phim-bo-moi', title: 'PHIM BỘ MỚI', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-le-moi', title: 'PHIM LẺ MỚI', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-chieu-rap', title: 'PHIM CHIẾU RẠP', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'hoat-hinh', title: 'PHIM HOẠT HÌNH', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-hot-trong-tuan', title: 'Phim Hot Trong Tuần', type: 'Horizontal', path: '' },
        { slug: 'danh-gia-cao', title: 'Đánh giá cao', type: 'Horizontal', path: '' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim bộ mới', slug: 'danh-sach/phim-bo-moi' },
        { name: 'Phim lẻ mới', slug: 'danh-sach/phim-le-moi' },
        { name: 'Chiếu rạp', slug: 'danh-sach/phim-chieu-rap' },
        { name: 'Hành động', slug: 'the-loai/hanh-dong' },
        { name: 'Hoạt hình', slug: 'the-loai/hoat-hinh' },
        { name: 'Tình Cảm', slug: 'the-loai/tinh-cam' },
        { name: 'Kinh Dị', slug: 'the-loai/kinh-di' }
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

        var baseUrl = "https://motchillz.cx/";
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
        return "https://motchillz.cx";
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    // Tạm cấu hình trang search
    return "https://motchillz.cx/tim-kiem/" + encodeURIComponent(keyword) + "?page=" + page;
}

function getUrlDetail(slug) {
    return "https://motchillz.cx/phim/" + slug;
}

function getUrlCategories() { return "https://motchillz.cx/"; }
function getUrlCountries() { return "https://motchillz.cx/"; }
function getUrlYears() { return "https://motchillz.cx/"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var movies = [];
    var moviesMap = {};
    var totalPages = 1;

    // Phân tích NextJS __next_f.push nếu nó được nhúng trong list dưới dạng json
    var nextDataRegex = /<script>self\.__next_f\.push\(\[1,"([^"]+)"\]\)<\/script>/g;
    var nextMatch;
    var allHtmlForNextjs = "";

    while ((nextMatch = nextDataRegex.exec(html)) !== null) {
        var data = nextMatch[1].replace(/\\"/g, '"');
        allHtmlForNextjs += data;

        if (totalPages === 1) {
            var pMatch = data.match(/totalPages["\']?\s*:\s*(\d+)/i) || data.match(/last_page["\']?\s*:\s*(\d+)/i);
            if (pMatch) {
                totalPages = parseInt(pMatch[1]);
            }
        }
    }

    // Lấy link dựa vào thẻ a
    var itemRegex = /<a[^>]+href="\/phim\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    var match;
    while ((match = itemRegex.exec(html)) !== null) {
        var slug = match[1];
        if (slug.indexOf('tap-') > -1) continue; // bỏ qua link tập trực tiếp

        var itemHtml = match[2];

        // Rút trích Title
        var titleMatch = itemHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i) || itemHtml.match(/title=["']([^"']+)["']/i) || itemHtml.match(/alt=["']([^"']+)["']/i);
        var title = titleMatch ? titleMatch[1] : "";

        // Rút trích Image url
        var thumbMatch = itemHtml.match(/<img[^>]*src=["']([^"']+)["']/i) || itemHtml.match(/srcset=["']([^ ]+) /i);
        var thumb = thumbMatch ? thumbMatch[1] : "";
        if (thumb && thumb.indexOf("http") !== 0) {
            thumb = "https://motchillz.cx" + (thumb.startsWith("/") ? "" : "/") + thumb;
        }

        // Rút trích episode current
        var epMatch = itemHtml.match(/((?:Tập|Full)[^<]+)/i) || itemHtml.match(/<span[^>]*bg-red[^>]*>(.*?)<\/span>/i);
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

    // Fallback: nếu listRegex không tìm thấy, parse từ nextjs logic
    if (Object.keys(moviesMap).length === 0) {
        var nListRegex = /\\"\/(phim\/[^\\"]+)\\"/g;  // Look for "/phim/xyz" inside nextjs json
        var nMatch;
        while ((nMatch = nListRegex.exec(allHtmlForNextjs)) !== null) {
            var nSlug = nMatch[1].replace('phim/', '');
            if (nSlug.indexOf('tap-') === -1) {
                if (!moviesMap[nSlug]) {
                    moviesMap[nSlug] = {
                        id: nSlug,
                        title: PluginUtils.cleanText(nSlug), // missing accurate title from regex fallback
                        posterUrl: "",
                        backdropUrl: "",
                        year: 0,
                        quality: "HD",
                        episode_current: "Full",
                        lang: "Vietsub"
                    };
                }
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
            totalPages: totalPages,
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
            thumb = "https://motchillz.cx" + (thumb.startsWith("/") ? "" : "/") + thumb;
        }

        var descriptionMatch = html.match(/<div[^>]*class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || html.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
        var description = descriptionMatch ? PluginUtils.cleanText(descriptionMatch[1]) : "";

        // Extract detailed metadata
        var casts = "";
        var director = "";
        var country = "";
        var year = 0;

        // Grab everything inside NextJS string chunks to parse metadata fully
        var allHtmlForNextjs = "";
        var nextDataRegex = /<script>self\.__next_f\.push\(\[1,"([^"]+)"\]\)<\/script>/g;
        var nextMatch;
        while ((nextMatch = nextDataRegex.exec(html)) !== null) {
            allHtmlForNextjs += nextMatch[1].replace(/\\"/g, '"');
        }

        var metaRegex = /<li[^>]*>(?:<span[^>]*>[^<]*<\/span>|[^<]*:)*([\s\S]*?)<\/li>/gi;
        var metaSearchStr = html + allHtmlForNextjs;
        var mMatch;
        while ((mMatch = metaRegex.exec(metaSearchStr)) !== null) {
            var liText = PluginUtils.cleanText(mMatch[0]);
            if (liText.toLowerCase().indexOf("đạo diễn:") > -1) {
                director = liText.replace(/Đạo diễn:/i, "").trim();
            } else if (liText.toLowerCase().indexOf("diễn viên:") > -1) {
                casts = liText.replace(/Diễn viên:/i, "").trim();
            } else if (liText.toLowerCase().indexOf("quốc gia:") > -1) {
                country = liText.replace(/Quốc gia:/i, "").trim();
            } else if (liText.toLowerCase().indexOf("năm phát hành:") > -1) {
                var yearStr = liText.replace(/Năm phát hành:/i, "").trim();
                year = parseInt(yearStr) || 0;
            }
        }

        var epsArr = [];
        var epRegex = /<a[^>]+href="([^"]*(?:\/phim\/)[^"]*tap-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
        var epMatch;
        var seenUrls = {};

        // Parse Standard Links
        while ((epMatch = epRegex.exec(html)) !== null) {
            var epUrl = epMatch[1];
            var epName = PluginUtils.cleanText(epMatch[2]);
            if (!epName || epName === "" || epName.indexOf("<svg") > -1) {
                var tMatch = epUrl.match(/tap-(\d+)/);
                epName = tMatch ? "Tập " + tMatch[1] : "Xem Ngay";
            }
            if (!seenUrls[epUrl]) {
                epsArr.push({ id: epUrl, name: epName, slug: epName });
                seenUrls[epUrl] = true;
            }
        }

        // Ensure reverse if episodes are ordered wrongly (usually VAAPP handles but good to check)

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
            description: description,
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: year,
            rating: 0,
            casts: casts,
            director: director,
            country: country,
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
                    "Origin": "https://motchillz.cx",
                    "Referer": "https://motchillz.cx"
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
