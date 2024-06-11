
/**
 * List of accessible URL Parameters
 */
const targetUrlParameters = ['title', 'description', 'sourceUrl', 'productImageUrl', 'qrSize'];

/**
 * Object to capture and store active URL Parameters from active Window Session
 */
const activeUrlParameters = {};

/**
 * Get's URL parameter by Name
 * 
 * @param {String} name - Target Parameter to search for
 * @returns 
 */
function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  const response = decodeURIComponent(results[2].replace(/\+/g, ' '));
  return new Promise(resolve => {
    resolve(response)
  })
}

document.addEventListener("DOMContentLoaded", async function () {
  setTimeout(async () => {
    /**
     * Location of Title ID in HTML
     * 
     * @see urlParam-Title
     */
    let titleLocation = document.getElementById('urlParam-Title');

    /**
     * Location of Description ID in HTML
     * 
     * @see urlParam-Description
     */
    let descriptionLocation = document.getElementById('urlParam-Description');

    /**
     * Location of the QR Div Container by ID in HTML
     * 
     * Used in Product Image Placement
     * @see urlParam-Description
     */
    let qrCodeContainerLocation = document.getElementById('qrContainer');

    /**
    * Location of the QR Image Location by ID in HTML
    * 
    * @see qrImage
    */
    let QrCodeImageLocation = document.getElementById('qrImage');

    /**
     * Destination URL for QR Code
     * 
     * @link [default] https://cisco.com
     */
    let destinationUrl = 'https://cisco.com';

    for (let param of targetUrlParameters) {
      activeUrlParameters[param] = await getParameterByName(param);
    }

    if (activeUrlParameters.sourceUrl != null && /^(ftp|http|https):\/\/[^ "]+$/.test(activeUrlParameters.sourceUrl)) {
      console.log('sourceUrl:', activeUrlParameters.sourceUrl)
      destinationUrl = activeUrlParameters.sourceUrl
    } else {
      console.error('A valid sourceUrl parameter is required for use')
      return
    }

    if (activeUrlParameters.title != null) {
      console.log('title:', activeUrlParameters.title)
      titleLocation.innerHTML = '<a href="' + activeUrlParameters.sourceUrl + '">' + activeUrlParameters.title + ' ' + '<i class="fa-solid fa-link" style="font-size: smaller;"></i></a>';
      descriptionLocation.textContent = '';
    } else {
      console.error('A title URL parameter is required for use')
      return
    }

    if (activeUrlParameters.description != null) {
      console.log('description:', activeUrlParameters.description)
      descriptionLocation.textContent = activeUrlParameters.description
    }

    if (activeUrlParameters.qrSize != null && /^[0-9]{1,3}[xX][0-9]{1,3}$/.test(activeUrlParameters.qrSize)) {
      console.log('qrSize:', activeUrlParameters.qrSize, '!Not Implemented')
      // activeUrlParameters.qrSize = activeUrlParameters.qrSize.toUpperCase()
      // console.log(activeUrlParameters.qrSize)
    } else {
      // activeUrlParameters.qrSize = '350X350'
      // console.log(activeUrlParameters.qrSize != null && /^[0-9]{1,3}[xX][0-9]{1,3}$/.test(activeUrlParameters.qrSize))
    }

    if (activeUrlParameters.productImageUrl != null) {
      console.log('productImageUrl', activeUrlParameters.productImageUrl)
      qrCodeContainerLocation.innerHTML = `<div class="columns is-mobile is-centered is-vcentered">
      <div class="column">
        <div class="my-custom-div">
          <img id="qrImage" src="${`https://api.qrserver.com/v1/create-qr-code/?size=350X350&margin=10&data=${encodeURIComponent(destinationUrl)}`}" alt="${activeUrlParameters.title}"style="border: 5px solid #ffb70f; border-radius: 25px; overflow: hidden;">
          <div class="content is-centered">
            Scan the QR above to take this content with you!
          </div>
        </div>
      </div>
      <div class="column">
        <div class="my-custom-div">
          <img id="productImage" src="${activeUrlParameters.productImageUrl}" alt="${activeUrlParameters.title} Image" style="max-height:350px; border: 5px solid #66d1ff; border-radius: 10px; overflow: hidden;">
        </div>
      </div>
    </div>`
    } else {
      qrCodeContainerLocation.innerHTML = `<div class="my-custom-div">
    <img id="qrImage" src="${`https://api.qrserver.com/v1/create-qr-code/?size=350X350&margin=10&data=${encodeURIComponent(destinationUrl)}`}" alt="${activeUrlParameters.title}"style="max-height=350; border: 5px solid #ffb70f; border-radius: 25px; overflow: hidden;">
    <div class="content is-centered">
      Scan the QR above to take this content with you!
    </div>
  </div>`
    }

    if (activeUrlParameters.title != null) {
      QrCodeImageLocation.alt = activeUrlParameters.title
    }
  }, 500)
});