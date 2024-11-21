using AutoMapper;
using Qayimli.APIs.Errors;
using Qayimli.APIs.Extensions;
using Qayimli.Core.Entities.Identity;
using Qayimli.Core.Service;
using Qayimli.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Qayimli.APIs.Dtos.Requests;
using Qayimli.APIs.Dtos.Responses;

namespace Qayimli.APIs.Controllers
{
    public class AccountsController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountsController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }
        //Register User
        [HttpPost("Register")]
        public async Task<ActionResult<UserResponseDto>> Register(RegisterRequestDto registerModel)
        {
            if(CheclEmailExist(registerModel.Email).Result.Value)
            {
                return  BadRequest(new ApiResponse(400,"this Email Exist"));
            }
            var user = new AppUser()
            {
                DisplayName = registerModel.DisplayName,
                Email = registerModel.Email,
                PictureUrl = registerModel.PictureUrl,
                UserName = registerModel.Email.Split('@')[0],
                PhoneNumber = registerModel.PhoneNumber,
            };
            var regRequestResult = await _userManager.CreateAsync(user, registerModel.Password);
            var mappedUser = _mapper.Map<UserResponseDto>(user); //using automapper
            mappedUser.Token = await _tokenService.CreateTokenAsync(user, _userManager);
            //var mappedUser = new UserDto()
            //{
            //    DisplayName = user.DisplayName,
            //    Email = user.Email,
            //    Token = await _tokenService.CreateTokenAsync(user, _userManager)
            //};
            return !regRequestResult.Succeeded ? BadRequest(new ApiResponse(400)) : Ok(mappedUser);
        }
        //Login User
        [HttpPost("Login")]
        public async Task<ActionResult<UserResponseDto>> Login(LoginRequestDto loginModel)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user is null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);

            var mappedUser = _mapper.Map<UserResponseDto>(user); //using automapper
            mappedUser.Token = await _tokenService.CreateTokenAsync(user, _userManager);


            return !result.Succeeded ? Unauthorized(new ApiResponse(401)) : Ok(mappedUser);
        }
        [Authorize]
        [HttpGet("GetCurrentUser")]
        public async Task<ActionResult<UserResponseDto>> GetCurrentUser()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(userEmail);
            var mappedUser = _mapper.Map<UserResponseDto>(user);
            mappedUser.Token = await _tokenService.CreateTokenAsync(user, _userManager);
            //var returnedUser = new UserDto()
            //{
            //    DisplayName = user.DisplayName,
            //    Email = user.Email,
            //    PhoneNumber = user.PhoneNumber,
            //    PictureUrl = user.PictureUrl,
            //    Token = await _tokenService.CreateTokenAsync(user, _userManager)
            //};
            return Ok(mappedUser);
        }
        [Authorize]
        [HttpGet("UserAddress")]//Get User Address
        public async Task<ActionResult<UserAddressResponseDto>> GetCurrentUserAddress()
        {
            var user = await _userManager.FindUserWithAddressAsync(User);
            var mappedAddress = _mapper.Map<UserAddress, UserAddressResponseDto>(user.UserAddress);
            return Ok(mappedAddress);
        }
        //Update User Address
        [Authorize]
        [HttpPut("UserAddress")]
        public async Task<ActionResult<UserAddressResponseDto>> UpdateUserAddress(UserAddressRequestDto updatedAddress)
        {
            var user = await _userManager.FindUserWithAddressAsync(User);
            if (user is null) return Unauthorized(new ApiResponse(401));
            var address = _mapper.Map<UserAddressRequestDto, UserAddress>(updatedAddress);
            user.UserAddress = address;
            var updateAddres = await _userManager.UpdateAsync(user);
            return updateAddres.Succeeded ? Ok(updateAddres) : BadRequest(new ApiResponse(400));
        }

        [HttpGet("EmailExist")]
        public async Task<ActionResult<bool>> CheclEmailExist(string email)
        {
            return await _userManager.FindByEmailAsync(email) is not null;
        }

        [Authorize] 
        [HttpGet("GetUserByEmail/{email}")]
        public async Task<ActionResult<UserResponseDto>> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound(new ApiResponse(404, "User not found"));

            var mappedUser = _mapper.Map<UserResponseDto>(user);
            mappedUser.Token = await _tokenService.CreateTokenAsync(user, _userManager); // if needed
            return Ok(mappedUser);
        }
    }
}
