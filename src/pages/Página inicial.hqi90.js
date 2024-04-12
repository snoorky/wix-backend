import { posts } from 'wix-blog-backend';

function substringByEstimatedLines(text, lineHeight, containerHeight, charsPerLine) {
	const lines = Math.floor(containerHeight / lineHeight);
	const totalChars = lines * charsPerLine;
	return text.substring(0, totalChars) + '...';
}

$w.onReady(function () {
	const lineHeight = 25;
	const containerHeight = 25;
	const charsPerLine = 24;
	const itemsPerPage = 16;
	let currentPage = 1;

	function loadPosts(pafe) {
		const offset = (page - 1) * itemsPerPage;
		posts.listPosts({ offset: offset, limit: itemsPerPage })
			.then((result) => {
				const posts = result.posts;
				console.log("Quantidade de posts:", posts.length);
				$w("#repeater4").data = posts;
			})
			.catch((error) => {
				console.error("Erro ao carregar os posts:", error);
			});
	}
	loadPosts(currentPage);

	$w("#repeater4").onItemReady(($item, itemData) => {
		let viewURL;
		if (itemData.media && itemData.media.wixMedia) {
			if (itemData.media.wixMedia.videoV2) {
				viewURL = itemData.media.wixMedia.videoV2;
			} else {
				if (itemData.media.wixMedia.image.includes('.jpeg/') || itemData.media.wixMedia.image.includes('.jpg/')) {
					viewURL = itemData.media.wixMedia.image;
				} else {
					viewURL = itemData.media.wixMedia.image.replace('wix:image://v1/', 'https://static.wixstatic.com/media/');
				}
			}
		} else {
			viewURL = "https://static.wixstatic.com/media/cebf22_21d55be7589c4ad08ae774b3c1c54464~mv2.webp";
		}

		$item('#imagemBlog').src = viewURL;

		$item("#tituloBlog").text = substringByEstimatedLines(itemData.title, lineHeight, containerHeight, charsPerLine);

		$item("#descricaoBlog").text = itemData.excerpt.substring(0, 50) + "...";

		$item("#linkBlog").link = "/post/" + itemData.slug;
	});

	$w("#pagination1").onChange((event) => {
		currentPage = event.target.value;
		loadPosts(currentPage);
	})
});